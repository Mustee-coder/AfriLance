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

    if (!socket.connected) {
      socket.connect();
      return;
    }

    setSendError("");
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
            acknowledgement?.error || "The message could not be sent.",
          );
          return;
        }

        setContent("");
      },
    );
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex w-full gap-2 border-t border-slate-200 bg-white p-3 sm:p-4"
      >
        <input
          type="text"
          value={content}
          onChange={(event) => handleTyping(event.target.value)}
          placeholder="Type a message..."
          maxLength={5000}
          disabled={sending}
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:px-4"
        />

        <button
          type="submit"
          disabled={!content.trim() || sending}
          className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
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
