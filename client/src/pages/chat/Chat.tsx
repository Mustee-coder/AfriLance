import { useCallback, useEffect, useRef, useState } from "react";
import {
  getConversationMessages,
  type Conversation,
  type Message,
} from "@/api/conversations.api";
import ConversationList from "@/components/chat/ConversationList";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import { useAuth } from "@/hooks/useAuth";
import { socket } from "@/socket/socket";

const mergeMessages = (
  currentMessages: Message[],
  incomingMessages: Message[],
  conversationId: string,
): Message[] => {
  const messagesById = new Map<string, Message>();

  for (const message of [...currentMessages, ...incomingMessages]) {
    if (message.conversation === conversationId) {
      messagesById.set(message._id, message);
    }
  }

  return [...messagesById.values()].sort(
    (first, second) =>
      Date.parse(first.createdAt) - Date.parse(second.createdAt) ||
      first._id.localeCompare(second._id),
  );
};

type SocketNotice =
  | { kind: "connection"; message: string }
  | { kind: "conversation"; conversationId: string; message: string };

const Chat = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [socketNotice, setSocketNotice] = useState<SocketNotice | null>(null);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);
  const historyCursorRef = useRef<string | null>(null);
  const requestedCursorsRef = useRef(new Set<string>());
  const loadingOlderMessagesRef = useRef(false);
  const hasMoreMessagesRef = useRef(false);
  const activeConversationIdRef = useRef<string | null>(null);
  const typingIndicatorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  activeConversationIdRef.current = selectedConversation?._id ?? null;

  // Socket connection
  useEffect(() => {
    const handleConnect = () => {
      setSocketNotice((currentNotice) =>
        currentNotice?.kind === "connection" ? null : currentNotice,
      );
    };

    const handleConnectError = (error: Error) => {
      setSocketNotice({
        kind: "connection",
        message: `Socket connection error: ${error.message}`,
      });
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
    };
  }, []);

  // Join conversation + receive real-time messages
  useEffect(() => {
    if (!selectedConversation) {
      setSocketNotice((currentNotice) =>
        currentNotice?.kind === "conversation" ? null : currentNotice,
      );
      return;
    }

    const conversationId = selectedConversation._id;
    setSocketNotice((currentNotice) =>
      currentNotice?.kind === "conversation" ? null : currentNotice,
    );

    const joinConversation = () => {
      socket.emit("join_conversation", conversationId);
    };

    const handleSocketError = (data: { message: string }) => {
      if (activeConversationIdRef.current !== conversationId) {
        return;
      }

      setSocketNotice({
        kind: "conversation",
        conversationId,
        message: `Socket error: ${data.message}`,
      });
    };

    const handleNewMessage = (message: Message) => {
      if (message.conversation !== conversationId) {
        return;
      }

      setMessages((currentMessages) =>
        mergeMessages(currentMessages, [message], conversationId),
      );
    };

    const handleMessageRead = (data: {
      messageId: string;
      conversationId: string;
      readBy: string;
      readAt: string;
    }) => {
      if (data.conversationId !== conversationId) {
        return;
      }

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message._id === data.messageId
            ? { ...message, read: true, readAt: data.readAt }
            : message,
        ),
      );
    };

    const handleUserTyping = (data: {
      conversationId: string;
      userId: string;
    }) => {
      if (data.conversationId !== conversationId) {
        return;
      }

      setTypingUserId(data.userId);

      if (typingIndicatorTimeoutRef.current) {
        clearTimeout(typingIndicatorTimeoutRef.current);
      }

      typingIndicatorTimeoutRef.current = setTimeout(() => {
        setTypingUserId((currentUserId) =>
          currentUserId === data.userId ? null : currentUserId,
        );
        typingIndicatorTimeoutRef.current = null;
      }, 6_000);
    };

    const handleUserStoppedTyping = (data: {
      conversationId: string;
      userId: string;
    }) => {
      if (data.conversationId !== conversationId) {
        return;
      }

      setTypingUserId((currentUserId) =>
        currentUserId === data.userId ? null : currentUserId,
      );
    };

    socket.on("socket_error", handleSocketError);
    socket.on("new_message", handleNewMessage);
    socket.on("message_read", handleMessageRead);
    socket.on("user_typing", handleUserTyping);
    socket.on("user_stopped_typing", handleUserStoppedTyping);
    socket.on("connect", joinConversation);

    if (socket.connected) {
      joinConversation();
    }

    return () => {
      socket.off("socket_error", handleSocketError);
      socket.off("new_message", handleNewMessage);
      socket.off("message_read", handleMessageRead);
      socket.off("user_typing", handleUserTyping);
      socket.off(
        "user_stopped_typing",
        handleUserStoppedTyping,
      );
      socket.off("connect", joinConversation);

      if (typingIndicatorTimeoutRef.current) {
        clearTimeout(typingIndicatorTimeoutRef.current);
        typingIndicatorTimeoutRef.current = null;
      }

      setTypingUserId(null);
    };
  }, [selectedConversation]);

  const handleLocalMessageRead = useCallback((messageId: string) => {
    setMessages((currentMessages) =>
      currentMessages.map((message) =>
        message._id === messageId
          ? { ...message, read: true, readAt: new Date().toISOString() }
          : message,
      ),
    );
  }, []);

  const loadOlderMessages = useCallback(async () => {
    const conversationId = selectedConversation?._id;
    const cursor = historyCursorRef.current;

    if (
      !conversationId ||
      !cursor ||
      !hasMoreMessagesRef.current ||
      loadingOlderMessagesRef.current ||
      requestedCursorsRef.current.has(cursor)
    ) {
      return;
    }

    requestedCursorsRef.current.add(cursor);
    loadingOlderMessagesRef.current = true;
    setLoadingOlderMessages(true);

    try {
      const data = await getConversationMessages(conversationId, {
        limit: 50,
        cursor,
      });

      if (activeConversationIdRef.current !== conversationId) {
        return;
      }

      setMessages((currentMessages) =>
        mergeMessages(currentMessages, data.messages, conversationId),
      );
      historyCursorRef.current = data.pagination.nextCursor;
      hasMoreMessagesRef.current = data.pagination.hasMore;
      setHasMoreMessages(data.pagination.hasMore);
    } catch (error) {
      console.error("Failed to load older messages:", error);
      requestedCursorsRef.current.delete(cursor);
    } finally {
      if (activeConversationIdRef.current === conversationId) {
        loadingOlderMessagesRef.current = false;
        setLoadingOlderMessages(false);
      }
    }
  }, [selectedConversation]);

  // Load conversation message history
  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      setLoading(false);
      setError("");
      setHasMoreMessages(false);
      setLoadingOlderMessages(false);
      loadingOlderMessagesRef.current = false;
      historyCursorRef.current = null;
      hasMoreMessagesRef.current = false;
      requestedCursorsRef.current.clear();
      return;
    }

    const conversationId = selectedConversation._id;
    let cancelled = false;

    setMessages([]);
    setLoading(true);
    setError("");
    setHasMoreMessages(false);
    setLoadingOlderMessages(false);
    loadingOlderMessagesRef.current = false;
    historyCursorRef.current = null;
    hasMoreMessagesRef.current = false;
    requestedCursorsRef.current.clear();

    const loadMessages = async () => {
      try {
        const data = await getConversationMessages(conversationId);

        if (!cancelled) {
          setMessages((currentMessages) =>
            mergeMessages(currentMessages, data.messages, conversationId),
          );
          historyCursorRef.current = data.pagination.nextCursor;
          hasMoreMessagesRef.current = data.pagination.hasMore;
          setHasMoreMessages(data.pagination.hasMore);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
        if (!cancelled) {
          setError("Failed to load messages");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadMessages();

    return () => {
      cancelled = true;
    };
  }, [selectedConversation]);

  const handleBackToConversations = () => {
    setSelectedConversation(null);
  };

  const typingParticipant =
    selectedConversation?.participants.find(
      (participant) => participant._id === typingUserId,
    );

  const visibleMessages = selectedConversation
    ? messages.filter(
        (message) => message.conversation === selectedConversation._id,
      )
    : [];
  const visibleSocketNotice =
    socketNotice?.kind === "connection" ||
    (socketNotice?.kind === "conversation" &&
      socketNotice.conversationId === selectedConversation?._id)
      ? socketNotice
      : null;

  return (
    <div className="min-h-[100dvh] bg-slate-50 p-4 sm:p-6">
      <h1 className="mb-4 text-2xl font-bold text-slate-950 sm:mb-6">
        Messages
      </h1>

      {visibleSocketNotice && (
        <div
          role="alert"
          className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>{visibleSocketNotice.message}</span>
          <button
            type="button"
            onClick={() => setSocketNotice(null)}
            aria-label="Dismiss socket error"
            className="shrink-0 rounded px-2 py-1 font-semibold text-red-700 transition hover:bg-red-100"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        {/* Conversation List */}
        <div
          className={`w-full lg:w-[320px] lg:shrink-0 ${
            selectedConversation ? "hidden lg:block" : "block"
          }`}
        >
          <ConversationList
            selectedConversationId={selectedConversation?._id}
            onSelectConversation={setSelectedConversation}
          />
        </div>

        {/* Chat */}
        <div
          className={`min-w-0 flex-1 ${
            selectedConversation ? "flex" : "hidden lg:flex"
          } h-[calc(100dvh-120px)] min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50 lg:h-auto lg:min-h-[600px]`}
        >
          {!selectedConversation && (
            <div className="flex flex-1 items-center justify-center p-6 text-center text-slate-500">
              Select a conversation to start chatting.
            </div>
          )}

          {selectedConversation && (
            <>
              {/* Mobile Chat Header */}
              <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white p-3 lg:hidden">
                <button
                  type="button"
                  onClick={handleBackToConversations}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                >
                  ← Back
                </button>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    {selectedConversation.job.title}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {selectedConversation.participants
                      .map(
                        (participant) =>
                          `${participant.firstName} ${participant.lastName}`,
                      )
                      .join(", ")}
                  </p>
                </div>
              </div>

              {/* Loading */}
              {loading && (
                <div className="flex min-h-0 flex-1 items-center justify-center text-slate-500">
                  Loading messages...
                </div>
              )}

              {/* Error */}
              {error && !loading && (
                <div className="flex min-h-0 flex-1 items-center justify-center p-6 text-center text-red-500">
                  {error}
                </div>
              )}

              {/* Messages + Input */}
              {!loading && !error && (
                <div className="flex min-h-0 flex-1 flex-col">
                  {/* Only this area should scroll */}
                  <div className="min-h-0 flex-1 overflow-hidden">
                    <MessageList
                      messages={visibleMessages}
                      currentUserId={user?.id ?? ""}
                      onMessageRead={handleLocalMessageRead}
                      hasMore={hasMoreMessages}
                      loadingOlder={loadingOlderMessages}
                      onLoadOlder={() => void loadOlderMessages()}
                    />
                  </div>

                  {/* Typing Indicator */}
                  {typingUserId && (
                    <div className="shrink-0 border-t border-slate-100 bg-white px-4 py-2">
                      <p className="text-xs font-medium text-emerald-600">
                        {typingParticipant
                          ? `${typingParticipant.firstName} ${typingParticipant.lastName} is typing...`
                          : "Someone is typing..."}
                      </p>
                    </div>
                  )}

                  {/* Always stays at bottom of chat container */}
                  <div className="shrink-0">
                    <MessageInput
                      conversationId={selectedConversation._id}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
