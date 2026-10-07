import { useEffect, useRef } from "react";
import type { Message } from "@/api/conversations.api";
import { socket } from "@/socket/socket";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onMessageRead: (messageId: string) => void;
}

const MessageList = ({
  messages,
  currentUserId,
  onMessageRead,
}: MessageListProps) => {
  const messageListRef = useRef<HTMLDivElement>(null);
  const emittedReadReceiptsRef = useRef(new Set<string>());

  useEffect(() => {
    const messageList = messageListRef.current;

    if (!messageList || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          const messageId = entry.target.getAttribute("data-message-id");
          const senderId = entry.target.getAttribute("data-sender-id");
          const message = messages.find((item) => item._id === messageId);

          if (
            !messageId ||
            !message ||
            senderId === currentUserId ||
            message.read ||
            emittedReadReceiptsRef.current.has(messageId)
          ) {
            continue;
          }

          emittedReadReceiptsRef.current.add(messageId);
          socket.emit("message_read", message._id);
          onMessageRead(message._id);
        }
      },
      { threshold: 0.5 },
    );

    messageList
      .querySelectorAll<HTMLElement>("[data-message-id]")
      .forEach((messageElement) => observer.observe(messageElement));

    return () => observer.disconnect();
  }, [currentUserId, messages, onMessageRead]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-center text-slate-500">
        No messages yet.
      </div>
    );
  }

  return (
    <div
      ref={messageListRef}
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden bg-slate-50 p-3 sm:p-4"
    >
      {messages.map((message) => (
        <div
          key={message._id}
          data-message-id={message._id}
          data-sender-id={message.sender._id}
          className="max-w-[90%] break-words rounded-xl border border-slate-100 bg-white p-3 shadow-sm sm:max-w-[75%]"
        >
          <p className="text-sm leading-6 text-slate-800">
            {message.content}
          </p>
          {message.sender._id === currentUserId && (
            <span className="mt-1 block text-right text-xs text-slate-400">
              {message.read ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
