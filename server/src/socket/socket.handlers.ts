import type { Server, Socket } from "socket.io";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import type { AuthenticatedSocket } from "./socket.middleware.js";
import {
  addUserConnection,
  removeUserConnection,
} from "./presence.service.js";

const TYPING_TTL_MS = 5_000;

type TypingState = {
  timer: ReturnType<typeof setTimeout>;
};

type SendMessageAcknowledgement = (
  response: { success: true } | { success: false; error: string },
) => void;

export const registerSocketHandlers = (
  io: Server,
  socket: Socket,
): void => {
  const authenticatedSocket = socket as AuthenticatedSocket;

  const userId = authenticatedSocket.user.userId;
  const typingStates = new Map<string, TypingState>();

  const emitTypingStopped = (conversationId: string) => {
    socket.to(`conversation:${conversationId}`).emit("user_stopped_typing", {
      conversationId,
      userId,
    });
  };

  const clearTypingState = (conversationId: string, notify = true) => {
    const typingState = typingStates.get(conversationId);

    if (!typingState) {
      return false;
    }

    clearTimeout(typingState.timer);
    typingStates.delete(conversationId);

    if (notify) {
      emitTypingStopped(conversationId);
    }

    return true;
  };

  const refreshTypingState = (conversationId: string) => {
    const timer = setTimeout(() => {
      clearTypingState(conversationId);
    }, TYPING_TTL_MS);

    const previousState = typingStates.get(conversationId);
    if (previousState) {
      clearTimeout(previousState.timer);
    }

    typingStates.set(conversationId, { timer });
  };

  const becameOnline = addUserConnection(userId);

  if (becameOnline) {
    socket.broadcast.emit("user_online", {
      userId,
    });
  }

  socket.on("join_conversation", async (conversationId: string) => {
    try {
      if (!conversationId) {
        socket.emit("socket_error", {
          message: "Conversation ID is required",
        });
        return;
      }

      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: userId,
      });

      if (!conversation) {
        socket.emit("socket_error", {
          message: "You are not allowed to join this conversation",
        });
        return;
      }

      const roomName = `conversation:${conversationId}`;

      await socket.join(roomName);

      socket.emit("conversation_joined", {
        conversationId,
      });

      console.log(`👤 ${userId} joined ${roomName}`);
    } catch (error) {
      console.error("Join conversation error:", error);

      socket.emit("socket_error", {
        message: "Failed to join conversation",
      });
    }
  });


socket.on(
  "typing_start",
  async (conversationId: string) => {
    try {
      if (!conversationId) {
        socket.emit("socket_error", {
          message: "Conversation ID is required",
        });
        return;
      }

      if (!typingStates.has(conversationId)) {
        const conversation = await Conversation.findOne({
          _id: conversationId,
          participants: userId,
        });

        if (!conversation) {
          socket.emit("socket_error", {
            message: "You are not allowed to type in this conversation",
          });
          return;
        }
      }

      if (!socket.connected) {
        return;
      }

      const roomName = `conversation:${conversationId}`;

      socket.to(roomName).emit("user_typing", {
        conversationId,
        userId,
      });
      refreshTypingState(conversationId);
    } catch (error) {
      console.error("Typing start error:", error);

      socket.emit("socket_error", {
        message: "Failed to start typing indicator",
      });
    }
  },
);

  socket.on(
    "typing_stop",
    async (conversationId: string) => {
      try {
        if (!conversationId) {
          socket.emit("socket_error", {
            message: "Conversation ID is required",
          });
          return;
        }

        if (clearTypingState(conversationId)) {
          return;
        }

        const conversation = await Conversation.findOne({
          _id: conversationId,
          participants: userId,
        });

        if (!conversation) {
          socket.emit("socket_error", {
            message:
              "You are not allowed to stop typing in this conversation",
          });
          return;
        }

        emitTypingStopped(conversationId);
      } catch (error) {
        console.error("Typing stop error:", error);

        socket.emit("socket_error", {
          message: "Failed to stop typing indicator",
        });
      }
    },
  );

  socket.on(
    "message_read",
    async (messageId: string) => {
      try {
        if (!messageId) {
          socket.emit("socket_error", {
            message: "Message ID is required",
          });
          return;
        }

        const message = await Message.findById(messageId);

        if (!message) {
          socket.emit("socket_error", {
            message: "Message not found",
          });
          return;
        }

        const conversation = await Conversation.findOne({
          _id: message.conversation,
          participants: userId,
        });

        if (!conversation) {
          socket.emit("socket_error", {
            message:
              "You are not allowed to read this message",
          });
          return;
        }

        if (message.sender.toString() === userId) {
          socket.emit("socket_error", {
            message: "You are not allowed to read your own message",
          });
          return;
        }

        if (!message.read) {
          message.read = true;
          message.readAt = new Date();

          await message.save();
        }

        const roomName = `conversation:${message.conversation}`;

        socket.to(roomName).emit("message_read", {
          messageId: message._id,
          conversationId: message.conversation,
          readBy: userId,
          readAt: message.readAt,
        });
      } catch (error) {
        console.error("Message read error:", error);

        socket.emit("socket_error", {
          message: "Failed to mark message as read",
        });
      }
    },
  );

  socket.on(
    "send_message",
    async (
      data: { conversationId: string; content: string },
      acknowledge?: SendMessageAcknowledgement,
    ) => {
      const reportFailure = (message: string) => {
        if (typeof acknowledge === "function") {
          acknowledge({ success: false, error: message });
        } else {
          socket.emit("socket_error", { message });
        }
      };

      try {
        const { conversationId, content } = data;

        if (!conversationId || typeof content !== "string") {
          reportFailure("Conversation ID and message content are required");
          return;
        }

        const trimmedContent = content.trim();

        if (!trimmedContent) {
          reportFailure("Message content cannot be empty");
          return;
        }

        if (trimmedContent.length > 5000) {
          reportFailure("Message cannot exceed 5000 characters");
          return;
        }

        const conversation = await Conversation.findOne({
          _id: conversationId,
          participants: userId,
        });

        if (!conversation) {
          reportFailure(
            "You are not allowed to send messages in this conversation",
          );
          return;
        }

        const message = await Message.create({
          conversation: conversation._id,
          sender: userId,
          content: trimmedContent,
          messageType: "text",
        });

        conversation.lastMessage = message._id;
        conversation.lastMessageAt = message.createdAt;

        await conversation.save();

        const populatedMessage = await Message.findById(
          message._id,
        ).populate("sender", "firstName lastName role");

        const roomName = `conversation:${conversationId}`;

        io.to(roomName).emit("new_message", populatedMessage);

        if (typeof acknowledge === "function") {
          acknowledge({ success: true });
        }

        console.log(
          `💬 Message sent in ${roomName} by ${userId}`,
        );
      } catch (error) {
        console.error("Send socket message error:", error);

        reportFailure("Failed to send message");
      }
    },
  );

  socket.on("disconnect", () => {
    for (const conversationId of typingStates.keys()) {
      clearTypingState(conversationId);
    }

    const becameOffline = removeUserConnection(userId);

    if (becameOffline) {
      socket.broadcast.emit("user_offline", {
        userId,
      });
    }

    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
};
