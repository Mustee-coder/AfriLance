import { useEffect, useState } from "react";
import {
  getMyConversations,
  type Conversation,
} from "@/api/conversations.api";

interface ConversationListProps {
  selectedConversationId?: string;
  onSelectConversation: (conversation: Conversation) => void;
}

const ConversationList = ({
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
  }, []);

  if (loading) {
    return (
      <div className="w-full rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          Loading conversations...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="w-full rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          No conversations yet.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white lg:w-[320px] lg:shrink-0">
      <div className="border-b border-slate-200 p-4">
        <h2 className="text-lg font-bold text-slate-950">
          Messages
        </h2>
      </div>

      <div className="max-h-[300px] overflow-y-auto lg:max-h-[600px]">
        {conversations.map((conversation) => {
          const isSelected =
            selectedConversationId === conversation._id;

          return (
            <button
              key={conversation._id}
              type="button"
              onClick={() => onSelectConversation(conversation)}
              className={`w-full border-b border-slate-100 p-4 text-left transition ${
                isSelected
                  ? "border-l-4 border-l-emerald-600 bg-emerald-50"
                  : "hover:bg-slate-50"
              }`}
            >
              <div className="flex min-w-0 items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    {conversation.participants
                      .map(
                        (participant) =>
                          `${participant.firstName} ${participant.lastName}`,
                      )
                      .join(", ")}
                  </p>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {conversation.job.title}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-lg px-2 py-1 text-[11px] font-bold capitalize ${
                    isSelected
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {conversation.job.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;

