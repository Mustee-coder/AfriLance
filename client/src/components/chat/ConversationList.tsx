import { useEffect, useState } from "react";
import {
  getMyConversations,
  type Conversation,
  type Message,
  type ConversationParticipant,
} from "@/api/conversations.api";
import { socket } from "@/socket/socket";

interface ConversationListProps {
  selectedConversationId?: string;
  currentUserId: string;
  onSelectConversation: (conversation: Conversation) => void;
}

const getParticipants = (conversation: Conversation) =>
  Array.isArray(conversation.participants)
    ? conversation.participants.filter(
        (participant): participant is ConversationParticipant =>
          Boolean(participant && typeof participant === "object"),
      )
    : [];

const getParticipantName = (participant?: ConversationParticipant) =>
  [participant?.firstName, participant?.lastName]
    .filter((part): part is string => Boolean(part?.trim()))
    .join(" ") || "Conversation participant";

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?";

const formatTimestamp = (value?: string) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  return sameDay
    ? new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
      }).format(date)
    : new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        ...(date.getFullYear() === now.getFullYear() ? {} : { year: "numeric" }),
      }).format(date);
};

const getLastMessagePreview = (conversation: Conversation) => {
  const lastMessage = conversation.lastMessage;

  if (lastMessage && typeof lastMessage === "object") {
    if (lastMessage.content?.trim()) {
      return lastMessage.content;
    }
    if (lastMessage.messageType === "image") {
      return "Photo";
    }
    if (lastMessage.messageType === "file") {
      return "File";
    }
    return "Message";
  }

  return lastMessage ? "Message preview unavailable" : "No messages yet";
};

const ConversationList = ({
  selectedConversationId,
  currentUserId,
  onSelectConversation,
}: ConversationListProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      setConversations((currentConversations) =>
        currentConversations
          .map((conversation) =>
            conversation._id === message.conversation
              ? {
                  ...conversation,
                  lastMessage: {
                    _id: message._id,
                    content: message.content,
                    messageType: message.messageType,
                    createdAt: message.createdAt,
                  },
                  lastMessageAt: message.createdAt,
                }
              : conversation,
          )
          .sort(
            (first, second) =>
              Date.parse(second.lastMessageAt ?? second.updatedAt) -
              Date.parse(first.lastMessageAt ?? first.updatedAt),
          ),
      );
    };

    socket.on("new_message", handleNewMessage);

    const loadConversations = async () => {
      try {
        const data = await getMyConversations();
        setConversations(data);
      } catch (error) {
        console.error("Failed to load conversations:", error);
        setError("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    void loadConversations();

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, []);

  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredConversations = conversations.filter((conversation) => {
    if (!normalizedSearch) {
      return true;
    }

    const participants = getParticipants(conversation);
    const searchableText = [
      conversation.job?.title,
      ...participants.map(getParticipantName),
      getLastMessagePreview(conversation),
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();

    return searchableText.includes(normalizedSearch);
  });

  if (loading) {
    return <p role="status" aria-live="polite" className="p-6 text-sm text-slate-500">Loading conversations...</p>;
  }

  if (error) {
    return <p role="alert" className="p-6 text-sm text-red-600">{error}</p>;
  }

  return (
    <section
      aria-label="Conversations"
      className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="shrink-0 border-b border-slate-200 p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Inbox</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {conversations.length} {conversations.length === 1 ? "conversation" : "conversations"}
            </p>
          </div>
        </div>
        <label className="sr-only" htmlFor="conversation-search">
          Search conversations by person, job, or message
        </label>
        <input
          id="conversation-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search messages"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/15"
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {conversations.length === 0 ? (
          <p role="status" className="p-6 text-center text-sm text-slate-500">
            No conversations yet.
          </p>
        ) : filteredConversations.length === 0 ? (
          <p role="status" className="p-6 text-center text-sm text-slate-500">
            No conversations match “{search}”.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filteredConversations.map((conversation) => {
          const isSelected =
            selectedConversationId === conversation._id;
          const participants = getParticipants(conversation);
          const otherParticipant =
            participants.find((participant) => participant._id !== currentUserId) ??
            participants[0];
          const participantName = getParticipantName(otherParticipant);
          const previewTime = formatTimestamp(
            (conversation.lastMessage && typeof conversation.lastMessage === "object"
              ? conversation.lastMessage.createdAt
              : undefined) ?? conversation.lastMessageAt,
          );

          return (
              <li key={conversation._id}>
                <button
                  type="button"
                  onClick={() => onSelectConversation(conversation)}
                  aria-pressed={isSelected}
                  className={`flex w-full items-center gap-3 border-l-[3px] px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600 ${
                    isSelected
                      ? "border-l-emerald-600 bg-emerald-50/70"
                      : "border-l-transparent hover:bg-slate-50"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800"
                  >
                    {getInitials(participantName)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-slate-900">
                        {participantName}
                      </span>
                      {previewTime && (
                        <time
                          dateTime={
                            (conversation.lastMessage && typeof conversation.lastMessage === "object"
                              ? conversation.lastMessage.createdAt
                              : undefined) ?? conversation.lastMessageAt
                          }
                          className="shrink-0 text-[11px] text-slate-500"
                        >
                          {previewTime}
                        </time>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-xs font-medium text-slate-600">
                      {conversation.job?.title || "Project conversation"}
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-500">
                      {getLastMessagePreview(conversation)}
                    </span>
                  </span>
                </button>
              </li>
          );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ConversationList;

