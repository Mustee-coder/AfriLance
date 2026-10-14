import { useEffect, useRef, useState } from "react";
import { socket } from "@/socket/socket";

interface MessageInputProps {
  conversationId: string;
}

interface SendMessageAcknowledgement {
  success: boolean;
  error?: string;
}

const MessageInput = ({
  conversationId,
}: MessageInputProps) => {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const sendingRef = useRef(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const handleTyping = (value: string) => {
    setContent(value);
    setSendError("");

    if (!socket.connected || !conversationId) {
      return;
    }

    socket.emit("typing_start", conversationId);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing_stop", conversationId);
      typingTimeoutRef.current = null;
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (socket.connected && conversationId) {
        socket.emit("typing_stop", conversationId);
      }
    };
  }, [conversationId]);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();

    if (sendingRef.current) {
      return;
    }

    const trimmedContent = content.trim();

    if (!trimmedContent || !conversationId) {
      return;
    }

    setSendError("");

    if (!socket.connected) {
      socket.connect();
      return;
    }

    sendingRef.current = true;
    setSending(true);

    socket.emit("typing_stop", conversationId);

    socket.timeout(10_000).emit(
      "send_message",
      {
        conversationId,
        content: trimmedContent,
      },
      (
        timeoutError: Error | null,
        acknowledgement?: SendMessageAcknowledgement,
      ) => {
        sendingRef.current = false;
        setSending(false);

        if (timeoutError) {
          setSendError(
            "The message could not be confirmed. Your draft is still here.",
          );
          return;
        }

        if (!acknowledgement?.success) {
          setSendError(
            `${acknowledgement?.error || "The message could not be sent."} Your draft is still here.`,
          );
          return;
        }

        setContent("");
      },
    );
  };

  return (
    <div className="bg-white">
      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center gap-2.5 p-3 sm:gap-3 sm:px-5 sm:py-4"
      >
        <input
          type="text"
          value={content}
          onChange={(event) => handleTyping(event.target.value)}
          placeholder="Type a message..."
          aria-label="Type a message"
          autoComplete="off"
          maxLength={5000}
          disabled={sending}
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/15 disabled:cursor-wait disabled:opacity-70 sm:px-4"
        />

        <button
          type="submit"
          disabled={!content.trim() || sending}
          className="shrink-0 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none sm:px-5"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
      {sendError && (
        <p
          role="status"
          aria-live="polite"
          className="bg-white px-4 pb-3 text-sm text-red-600"
        >
          {sendError}
        </p>
      )}
    </div>
  );
};

export default MessageInput;
