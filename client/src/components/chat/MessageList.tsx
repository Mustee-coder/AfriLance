import type { Message } from "@/api/conversations.api";

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-center text-slate-500">
        No messages yet.
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden bg-slate-50 p-3 sm:p-4">
      {messages.map((message) => (
        <div
          key={message._id}
          className="max-w-[90%] break-words rounded-xl border border-slate-100 bg-white p-3 shadow-sm sm:max-w-[75%]"
        >
          <p className="text-sm leading-6 text-slate-800">
            {message.content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;

