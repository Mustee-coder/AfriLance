import { Fragment, useEffect, useLayoutEffect, useRef } from "react";
import type { Message } from "@/api/conversations.api";
import { socket } from "@/socket/socket";

const normalizeUserId = (value: string | null | undefined): string =>
  value?.trim().toLowerCase() ?? "";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onMessageRead: (messageId: string) => void;
  hasMore: boolean;
  loadingOlder: boolean;
  onLoadOlder: () => void;
}

const formatMessageTime = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
      }).format(date);
};

const formatMessageDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (sameDay) {
    return "Today";
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  ) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    ...(date.getFullYear() === now.getFullYear() ? {} : { year: "numeric" }),
  }).format(date);
};

const MessageList = ({
  messages,
  currentUserId,
  onMessageRead,
  hasMore,
  loadingOlder,
  onLoadOlder,
}: MessageListProps) => {
  const normalizedCurrentUserId = normalizeUserId(currentUserId);
  const messageListRef = useRef<HTMLDivElement>(null);
  const emittedReadReceiptsRef = useRef(new Set<string>());
  const pendingScrollAdjustmentRef = useRef(false);
  const hasPositionedInitialMessagesRef = useRef(false);
  const wasNearBottomRef = useRef(true);
  const latestMessageIdRef = useRef<string | null>(null);
  const scrollAnchorRef = useRef<{
    messageId: string;
    offsetTop: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (!loadingOlder && pendingScrollAdjustmentRef.current) {
      const messageList = messageListRef.current;
      const anchor = scrollAnchorRef.current;

      if (messageList && anchor) {
        const anchoredMessage = messageList.querySelector<HTMLElement>(
          `[data-message-id="${anchor.messageId}"]`,
        );

        if (anchoredMessage) {
          const containerTop = messageList.getBoundingClientRect().top;
          const currentOffsetTop =
            anchoredMessage.getBoundingClientRect().top - containerTop;
          messageList.scrollTop += currentOffsetTop - anchor.offsetTop;
        }
      }

      pendingScrollAdjustmentRef.current = false;
      scrollAnchorRef.current = null;
    }

    const messageList = messageListRef.current;
    const latestMessageId = messages[messages.length - 1]?._id ?? null;

    if (messageList && !pendingScrollAdjustmentRef.current) {
      if (!hasPositionedInitialMessagesRef.current) {
        messageList.scrollTop = messageList.scrollHeight;
        hasPositionedInitialMessagesRef.current = true;
        wasNearBottomRef.current = true;
      } else if (
        latestMessageId &&
        latestMessageId !== latestMessageIdRef.current &&
        wasNearBottomRef.current
      ) {
        messageList.scrollTop = messageList.scrollHeight;
      }
    }

    latestMessageIdRef.current = latestMessageId;
  }, [loadingOlder, messages.length]);

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
          const message = messages.find((item) => item._id === messageId);
          const senderId = normalizeUserId(message?.sender?._id);

          if (
            !messageId ||
            !message ||
            !normalizedCurrentUserId ||
            !senderId ||
            senderId === normalizedCurrentUserId ||
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
  }, [normalizedCurrentUserId, messages, onMessageRead]);

  const handleScroll = () => {
    const messageList = messageListRef.current;

    if (messageList) {
      wasNearBottomRef.current =
        messageList.scrollHeight -
          messageList.scrollTop -
          messageList.clientHeight <=
        120;
    }

    if (
      !messageList ||
      messageList.scrollTop > 120 ||
      loadingOlder ||
      !hasMore
    ) {
      return;
    }

    const firstVisibleMessage = Array.from(
      messageList.querySelectorAll<HTMLElement>("[data-message-id]"),
    ).find(
      (element) =>
        element.getBoundingClientRect().bottom >
        messageList.getBoundingClientRect().top,
    );

    if (firstVisibleMessage) {
      scrollAnchorRef.current = {
        messageId: firstVisibleMessage.dataset.messageId ?? "",
        offsetTop:
          firstVisibleMessage.getBoundingClientRect().top -
          messageList.getBoundingClientRect().top,
      };
    } else {
      scrollAnchorRef.current = null;
    }
    pendingScrollAdjustmentRef.current = true;
    onLoadOlder();
  };

  if (messages.length === 0) {
    return (
      <div
        role="status"
        className="flex flex-1 items-center justify-center p-6 text-center text-slate-500"
      >
        No messages yet.
      </div>
    );
  }

  return (
    <div
      ref={messageListRef}
      onScroll={handleScroll}
      role="log"
      aria-label="Message history"
      aria-relevant="additions text"
      className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden overscroll-contain bg-slate-50/80 p-3 sm:gap-5 sm:p-6"
    >
      {loadingOlder && (
        <div role="status" aria-live="polite" className="text-center text-xs text-slate-500">
          Loading older messages...
        </div>
      )}

      {messages.map((message, index) => {
        const senderId = normalizeUserId(message.sender?._id);
        const isOwnMessage =
          Boolean(normalizedCurrentUserId) &&
          senderId === normalizedCurrentUserId;
        const senderName = [message.sender?.firstName, message.sender?.lastName]
          .filter((part): part is string => Boolean(part?.trim()))
          .join(" ") || "Conversation participant";
        const messageDate = formatMessageDate(message.createdAt);
        const previousDate =
          index > 0 ? formatMessageDate(messages[index - 1].createdAt) : "";
        const showDateDivider = Boolean(messageDate && messageDate !== previousDate);
        const time = formatMessageTime(message.createdAt);

        return (
          <Fragment key={message._id}>
            {showDateDivider && (
              <div
                role="separator"
                aria-label={messageDate}
                className="flex items-center gap-3 py-1 text-[11px] font-medium text-slate-500"
              >
                <span className="h-px flex-1 bg-slate-200" />
                <span>{messageDate}</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
            )}
            <div
              className={`flex w-full ${
                isOwnMessage ? "justify-end" : "justify-start"
              }`}
            >
              <article
                data-message-id={message._id}
                data-sender-id={senderId}
                aria-label={isOwnMessage ? "Message sent by you" : `Message from ${senderName}`}
                className={`w-fit max-w-[88%] break-words rounded-2xl px-3.5 py-2.5 shadow-sm sm:max-w-[72%] sm:px-4 ${
                  isOwnMessage
                    ? "rounded-br-md bg-emerald-700 text-white"
                    : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
                }`}
              >
                {!isOwnMessage && (
                  <p className="mb-1 text-xs font-semibold text-emerald-800">
                    {senderName}
                  </p>
                )}
                <p className="whitespace-pre-wrap text-sm leading-6">
                  {message.content || "Message unavailable"}
                </p>
                {(time || isOwnMessage) && (
                  <div
                    className={`mt-1.5 flex items-center justify-end gap-1.5 text-[11px] ${
                      isOwnMessage ? "text-emerald-100" : "text-slate-500"
                    }`}
                  >
                    {time && <time dateTime={message.createdAt}>{time}</time>}
                    {isOwnMessage && (
                      <span aria-label={message.read ? "Read" : "Sent"}>
                        {message.read ? "✓✓" : "✓"}
                      </span>
                    )}
                  </div>
                )}
              </article>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default MessageList;
