import { useEffect, useState } from "react";
import {
  getConversationMessages,
  type Conversation,
  type Message,
} from "@/api/conversations.api";
import ConversationList from "@/components/chat/ConversationList";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import { socket } from "@/socket/socket";

const Chat = () => {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [typingUserId, setTypingUserId] = useState<string | null>(null);

  // Socket connection
  useEffect(() => {
  const handleConnect = () => {
    alert(`🔌 Socket connected: ${socket.id}`);
  };

  const handleConnectError = (error: Error) => {
    alert(`❌ Socket connection error: ${error.message}`);
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
      return;
    }

    const conversationId = selectedConversation._id;

    const handleConversationJoined = (data: {
      conversationId: string;
    }) => {
      if (data.conversationId === conversationId) {
        alert(`✅ Joined conversation: ${conversationId}`);
      }
    };

    const handleSocketError = (data: { message: string }) => {
      alert(`❌ Socket error: ${data.message}`);
    };

    const handleNewMessage = (message: Message) => {
      if (message.conversation !== conversationId) {
        return;
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        message,
      ]);
    };

    const handleUserTyping = (data: {
      conversationId: string;
      userId: string;
    }) => {
      if (data.conversationId !== conversationId) {
        return;
      }

      setTypingUserId(data.userId);
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

    socket.on("conversation_joined", handleConversationJoined);
    socket.on("socket_error", handleSocketError);
    socket.on("new_message", handleNewMessage);
    socket.on("user_typing", handleUserTyping);
    socket.on("user_stopped_typing", handleUserStoppedTyping);

    socket.emit("join_conversation", conversationId);

    return () => {
      socket.off(
        "conversation_joined",
        handleConversationJoined,
      );
      socket.off("socket_error", handleSocketError);
      socket.off("new_message", handleNewMessage);
      socket.off("user_typing", handleUserTyping);
      socket.off(
        "user_stopped_typing",
        handleUserStoppedTyping,
      );

      setTypingUserId(null);
    };
  }, [selectedConversation]);

  // Load conversation message history
  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getConversationMessages(
          selectedConversation._id,
        );

        setMessages(data);
      } catch (error) {
        console.error("Failed to load messages:", error);
        setError("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    void loadMessages();
  }, [selectedConversation]);

  const handleBackToConversations = () => {
    setSelectedConversation(null);
  };

  const typingParticipant =
    selectedConversation?.participants.find(
      (participant) => participant._id === typingUserId,
    );

  return (
    <div className="min-h-[100dvh] bg-slate-50 p-4 sm:p-6">
      <h1 className="mb-4 text-2xl font-bold text-slate-950 sm:mb-6">
        Messages
      </h1>

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
                    <MessageList messages={messages} />
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