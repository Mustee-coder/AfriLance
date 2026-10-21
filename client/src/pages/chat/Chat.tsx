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

type PresenceSnapshotEntry = {
  userId: string;
  online: boolean;
  revision: number;
};

type PresenceSnapshotPayload = {
  users: PresenceSnapshotEntry[];
};

type PresenceLivePayload = Pick<PresenceSnapshotEntry, "userId" | "revision">;

type PresenceSnapshotErrorPayload = { message: string };

type PresenceDelta = PresenceSnapshotEntry;

const isPresenceLivePayload = (
  value: Record<string, unknown>,
): value is Record<string, unknown> & PresenceLivePayload =>
  typeof value.userId === "string" &&
  typeof value.revision === "number" &&
  Number.isSafeInteger(value.revision) &&
  value.revision >= 0;

const isPresenceSnapshotErrorPayload = (
  value: unknown,
): value is PresenceSnapshotErrorPayload =>
  Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as Record<string, unknown>).message === "string",
  );

const normalizeUserId = (value: string | null | undefined): string =>
  value?.trim().toLowerCase() ?? "";

const parsePresenceDelta = (
  value: unknown,
  online?: boolean,
): PresenceDelta | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const data = value as Record<string, unknown>;
  if (online !== undefined && !isPresenceLivePayload(data)) {
    return null;
  }
  const userId = normalizeUserId(
    typeof data.userId === "string" ? data.userId : "",
  );
  const isOnline = online ?? data.online;

  if (
    !userId ||
    typeof isOnline !== "boolean" ||
    typeof data.revision !== "number" ||
    !Number.isSafeInteger(data.revision) ||
    data.revision < 0
  ) {
    return null;
  }

  return { userId, online: isOnline, revision: data.revision };
};

const parsePresenceSnapshot = (
  value: unknown,
): PresenceSnapshotPayload | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const users = (value as Record<string, unknown>).users;
  if (!Array.isArray(users)) {
    return null;
  }

  const parsedUsers: PresenceDelta[] = [];
  for (const user of users) {
    const parsed = parsePresenceDelta(user);
    if (!parsed) {
      return null;
    }
    parsedUsers.push(parsed);
  }

  return { users: parsedUsers };
};

const Chat = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [socketNotice, setSocketNotice] = useState<SocketNotice | null>(null);
  const [presenceByUserId, setPresenceByUserId] = useState<
    Record<string, boolean>
  >({});
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
  const presenceRevisionsRef = useRef(new Map<string, number>());
  const bufferedPresenceEventsRef = useRef<PresenceDelta[]>([]);
  const presenceSnapshotPendingRef = useRef(false);
  const presenceSnapshotReadyRef = useRef(false);
  const refreshAfterSnapshotRef = useRef(false);

  const applyPresenceDelta = useCallback((delta: PresenceDelta) => {
    const previousRevision = presenceRevisionsRef.current.get(delta.userId);
    if (previousRevision !== undefined && delta.revision <= previousRevision) {
      return;
    }

    presenceRevisionsRef.current.set(delta.userId, delta.revision);
    setPresenceByUserId((currentPresence) => ({
      ...currentPresence,
      [delta.userId]: delta.online,
    }));
  }, []);

  const requestPresenceSnapshot = useCallback(() => {
    if (!socket.connected) {
      return;
    }

    if (presenceSnapshotPendingRef.current) {
      refreshAfterSnapshotRef.current = true;
      return;
    }

    presenceSnapshotPendingRef.current = true;
    presenceSnapshotReadyRef.current = false;
    bufferedPresenceEventsRef.current = [];
    socket.emit("request_presence_snapshot");
  }, []);

  const finishPresenceSnapshot = useCallback(
    (snapshot: PresenceSnapshotPayload) => {
      const nextRevisions = new Map<string, number>();
      const nextPresence: Record<string, boolean> = {};

      for (const user of snapshot.users) {
        const existingRevision = nextRevisions.get(user.userId);
        if (existingRevision !== undefined && existingRevision >= user.revision) {
          continue;
        }
        nextRevisions.set(user.userId, user.revision);
        nextPresence[user.userId] = user.online;
      }

      for (const delta of bufferedPresenceEventsRef.current) {
        const existingRevision = nextRevisions.get(delta.userId);
        if (existingRevision !== undefined && delta.revision <= existingRevision) {
          continue;
        }
        nextRevisions.set(delta.userId, delta.revision);
        nextPresence[delta.userId] = delta.online;
      }

      presenceRevisionsRef.current = nextRevisions;
      bufferedPresenceEventsRef.current = [];
      presenceSnapshotPendingRef.current = false;
      presenceSnapshotReadyRef.current = true;
      setPresenceByUserId(nextPresence);

      if (refreshAfterSnapshotRef.current) {
        refreshAfterSnapshotRef.current = false;
        requestPresenceSnapshot();
      }
    },
    [requestPresenceSnapshot],
  );

  const finishFailedPresenceSnapshot = useCallback(() => {
    if (!presenceSnapshotPendingRef.current) {
      return;
    }

    presenceSnapshotPendingRef.current = false;
    presenceSnapshotReadyRef.current = true;
    const bufferedEvents = bufferedPresenceEventsRef.current;
    bufferedPresenceEventsRef.current = [];
    for (const delta of bufferedEvents) {
      applyPresenceDelta(delta);
    }
    refreshAfterSnapshotRef.current = false;
  }, [applyPresenceDelta]);

  activeConversationIdRef.current = selectedConversation?._id ?? null;

  // Socket connection
  useEffect(() => {
    const resetPresence = () => {
      presenceSnapshotPendingRef.current = false;
      presenceSnapshotReadyRef.current = false;
      refreshAfterSnapshotRef.current = false;
      bufferedPresenceEventsRef.current = [];
      presenceRevisionsRef.current.clear();
      setPresenceByUserId({});
    };

    const handleConnect = () => {
      resetPresence();
      setSocketNotice((currentNotice) =>
        currentNotice?.kind === "connection" ? null : currentNotice,
      );
      requestPresenceSnapshot();
    };

    const handleConnectError = (error: Error) => {
      setSocketNotice({
        kind: "connection",
        message: `Socket connection error: ${error.message}`,
      });
    };

    const handleDisconnect = () => {
      resetPresence();
    };

    const handlePresenceSnapshot = (data: unknown) => {
      const snapshot = parsePresenceSnapshot(data);
      if (!snapshot) {
        finishFailedPresenceSnapshot();
        return;
      }
      finishPresenceSnapshot(snapshot);
    };

    const handlePresenceSnapshotError = (data: unknown) => {
      if (isPresenceSnapshotErrorPayload(data)) {
        console.error("Presence snapshot failed:", data.message);
      }
      finishFailedPresenceSnapshot();
    };

    const handlePresenceChange = (online: boolean) => (data: unknown) => {
      const delta = parsePresenceDelta(data, online);
      if (!delta) {
        return;
      }

      if (!presenceSnapshotReadyRef.current) {
        bufferedPresenceEventsRef.current.push(delta);
        return;
      }
      applyPresenceDelta(delta);
    };

    const handleUserOnline = handlePresenceChange(true);
    const handleUserOffline = handlePresenceChange(false);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        requestPresenceSnapshot();
      }
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);
    socket.on("presence_snapshot", handlePresenceSnapshot);
    socket.on("presence_snapshot_error", handlePresenceSnapshotError);
    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleUserOffline);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (socket.connected) {
      requestPresenceSnapshot();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);
      socket.off("presence_snapshot", handlePresenceSnapshot);
      socket.off("presence_snapshot_error", handlePresenceSnapshotError);
      socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleUserOffline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      presenceSnapshotPendingRef.current = false;
      presenceSnapshotReadyRef.current = false;
      refreshAfterSnapshotRef.current = false;
      bufferedPresenceEventsRef.current = [];
      presenceRevisionsRef.current.clear();
    };
  }, [
    applyPresenceDelta,
    finishFailedPresenceSnapshot,
    finishPresenceSnapshot,
    requestPresenceSnapshot,
  ]);

  // Join conversation + receive real-time messages
  useEffect(() => {
    if (!selectedConversation) {
      setSocketNotice((currentNotice) =>
        currentNotice?.kind === "conversation" ? null : currentNotice,
      );
      return;
    }

    const conversationId = selectedConversation._id;
    requestPresenceSnapshot();
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
  }, [requestPresenceSnapshot, selectedConversation]);

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
    selectedConversation?.participants?.find(
      (participant) => participant?._id === typingUserId,
    );

  const activeParticipants = Array.isArray(selectedConversation?.participants)
    ? selectedConversation.participants.filter(
        (participant) => participant && typeof participant === "object",
      )
    : [];
  const activeParticipant =
    activeParticipants.find(
      (participant) =>
        normalizeUserId(participant?._id) !== normalizeUserId(user?.id),
    ) ?? activeParticipants[0];
  const activeParticipantName =
    [activeParticipant?.firstName, activeParticipant?.lastName]
      .filter((part): part is string => Boolean(part?.trim()))
      .join(" ") || "Conversation participant";
  const activeParticipantInitials =
    activeParticipantName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?";
  const activeParticipantId = normalizeUserId(activeParticipant?._id);
  const activeParticipantOnline = activeParticipantId
    ? presenceByUserId[activeParticipantId]
    : undefined;

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
    <main className="h-[100dvh] overflow-hidden bg-slate-50 p-2 sm:p-4">
      <div className="mx-auto flex h-full min-h-0 max-w-[1600px] flex-col gap-3 sm:gap-4">
        <header className="flex shrink-0 items-center justify-between px-1">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              Messages
            </h1>
            <p className="mt-0.5 hidden text-sm text-slate-500 sm:block">
              Your conversations with clients and developers
            </p>
          </div>
        </header>

        {visibleSocketNotice && (
          <div
            role="alert"
            className="flex shrink-0 items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <span>{visibleSocketNotice.message}</span>
            <button
              type="button"
              onClick={() => setSocketNotice(null)}
              aria-label="Dismiss socket error"
              className="shrink-0 rounded px-2 py-1 font-semibold text-red-700 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex min-h-0 flex-1 gap-3 sm:gap-4">
          <aside
            className={`min-h-0 w-full flex-col lg:flex lg:w-[360px] lg:shrink-0 ${
              selectedConversation ? "hidden" : "flex"
            }`}
          >
            <ConversationList
              selectedConversationId={selectedConversation?._id}
              currentUserId={user?.id ?? ""}
              presenceByUserId={presenceByUserId}
              onSelectConversation={setSelectedConversation}
            />
          </aside>

          <section
            aria-label={
              selectedConversation
                ? `Conversation with ${activeParticipantName}`
                : "Active conversation"
            }
            className={`min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${
              selectedConversation ? "flex" : "hidden lg:flex"
            }`}
          >
            {!selectedConversation ? (
              <div className="hidden flex-1 flex-col items-center justify-center p-8 text-center lg:flex">
                <span
                  aria-hidden="true"
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-700"
                >
                  ✉
                </span>
                <h2 className="text-base font-semibold text-slate-900">
                  Choose a conversation
                </h2>
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  Select a conversation to view messages and continue the discussion.
                </p>
              </div>
            ) : (
              <>
                <header className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-3 py-3 sm:px-5 sm:py-4">
                  <button
                    type="button"
                    onClick={handleBackToConversations}
                    aria-label="Back to conversations"
                    className="rounded-lg px-2.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 lg:hidden"
                  >
                    <span aria-hidden="true">←</span>
                    <span className="ml-1.5">Back</span>
                  </button>
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800"
                  >
                    {activeParticipantInitials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-sm font-semibold text-slate-950 sm:text-base">
                      {activeParticipantName}
                    </h2>
                    <p className="truncate text-xs text-slate-500 sm:text-sm">
                      {selectedConversation.job?.title || "Project conversation"}
                    </p>
                    {activeParticipantOnline !== undefined && (
                      <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-600">
                        <span
                          aria-hidden="true"
                          className={`h-2 w-2 rounded-full ${
                            activeParticipantOnline
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        />
                        {activeParticipantOnline ? "Online" : "Offline"}
                      </span>
                    )}
                  </div>
                  {selectedConversation.job?.status && (
                    <span className="hidden shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600 sm:inline-flex">
                      {selectedConversation.job.status.replaceAll("_", " ")}
                    </span>
                  )}
                </header>

                {loading ? (
                  <div
                    role="status"
                    aria-live="polite"
                    className="flex min-h-0 flex-1 items-center justify-center p-6 text-sm text-slate-500"
                  >
                    Loading messages…
                  </div>
                ) : error ? (
                  <div
                    role="alert"
                    className="flex min-h-0 flex-1 items-center justify-center p-6 text-center text-sm text-red-700"
                  >
                    {error}
                  </div>
                ) : (
                  <div className="flex min-h-0 flex-1 flex-col">
                    <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
                      <MessageList
                        messages={visibleMessages}
                        currentUserId={user?.id ?? ""}
                        onMessageRead={handleLocalMessageRead}
                        hasMore={hasMoreMessages}
                        loadingOlder={loadingOlderMessages}
                        onLoadOlder={() => void loadOlderMessages()}
                      />
                    </div>

                    {typingUserId && (
                      <div
                        role="status"
                        aria-live="polite"
                        className="shrink-0 border-t border-slate-100 bg-white px-4 py-2"
                      >
                        <p className="text-xs font-medium text-emerald-700">
                          {typingParticipant
                            ? `${typingParticipant.firstName || "Someone"} ${typingParticipant.lastName || ""} is typing...`
                            : "Someone is typing..."}
                        </p>
                      </div>
                    )}

                    <div className="shrink-0 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]">
                      <MessageInput conversationId={selectedConversation._id} />
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Chat;
