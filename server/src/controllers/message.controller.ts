import type { Response } from "express";
import { Types } from "mongoose";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

const DEFAULT_MESSAGE_PAGE_SIZE = 50;
const MAX_MESSAGE_PAGE_SIZE = 100;

interface MessageCursor {
  createdAt: string;
  _id: string;
}

const parseLimit = (value: unknown): number => {
  if (value === undefined) {
    return DEFAULT_MESSAGE_PAGE_SIZE;
  }

  if (
    typeof value !== "string" ||
    !/^\d+$/.test(value)
  ) {
    throw new Error("Invalid limit");
  }

  const parsedLimit = Number(value);

  if (!Number.isSafeInteger(parsedLimit) || parsedLimit < 1) {
    throw new Error("Invalid limit");
  }

  return Math.min(parsedLimit, MAX_MESSAGE_PAGE_SIZE);
};

const decodeCursor = (value: unknown): MessageCursor | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string" || value.length === 0) {
    throw new Error("Invalid cursor");
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    ) as Partial<MessageCursor>;

    if (
      typeof decoded.createdAt !== "string" ||
      Number.isNaN(Date.parse(decoded.createdAt)) ||
      typeof decoded._id !== "string" ||
      !Types.ObjectId.isValid(decoded._id)
    ) {
      throw new Error("Invalid cursor");
    }

    return {
      createdAt: new Date(decoded.createdAt).toISOString(),
      _id: decoded._id,
    };
  } catch {
    throw new Error("Invalid cursor");
  }
};

const encodeCursor = (message: {
  createdAt: Date;
  _id: Types.ObjectId;
}): string =>
  Buffer.from(
    JSON.stringify({
      createdAt: message.createdAt.toISOString(),
      _id: message._id.toString(),
    }),
  ).toString("base64url");

const getConversationForParticipant = async (
  conversationId: string,
  userId: string,
) => {
  if (!Types.ObjectId.isValid(conversationId)) {
    return null;
  }

  return Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });
};

export const getMessages = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const conversationId = req.params.id as string;

    if (!Types.ObjectId.isValid(conversationId)) {
      res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
      return;
    }

    const conversation = await getConversationForParticipant(
      conversationId,
      req.user.userId,
    );

    if (!conversation) {
      res.status(403).json({
        success: false,
        message: "You are not allowed to access this conversation",
      });
      return;
    }

    let limit: number;
    let cursor: MessageCursor | undefined;

    try {
      limit = parseLimit(req.query.limit);
      cursor = decodeCursor(req.query.cursor);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Invalid pagination parameters",
      });
      return;
    }

    const messageFilter = {
      conversation: conversation._id,
      ...(cursor
        ? {
            $or: [
              { createdAt: { $lt: new Date(cursor.createdAt) } },
              {
                createdAt: new Date(cursor.createdAt),
                _id: { $lt: new Types.ObjectId(cursor._id) },
              },
            ],
          }
        : {}),
    };

    const [totalCount, queriedMessages] = await Promise.all([
      Message.countDocuments({ conversation: conversation._id }),
      Message.find(messageFilter)
        .sort({ createdAt: -1, _id: -1 })
        .limit(limit + 1)
        .populate("sender", "firstName lastName role"),
    ]);

    const hasMore = queriedMessages.length > limit;
    const pageMessages = (hasMore
      ? queriedMessages.slice(0, limit)
      : queriedMessages
    ).reverse();

    const nextCursor =
      hasMore && pageMessages.length > 0
        ? encodeCursor(pageMessages[0])
        : null;

    res.status(200).json({
      success: true,
      count: totalCount,
      messages: pageMessages,
      pagination: {
        hasMore,
        nextCursor,
      },
    });
  } catch (error) {
    console.error("Get messages error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const conversationId = req.params.id as string;
    const { content } = req.body;

    if (!Types.ObjectId.isValid(conversationId)) {
      res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
      return;
    }

    if (
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      res.status(400).json({
        success: false,
        message: "Message content is required",
      });
      return;
    }

    if (content.trim().length > 5000) {
      res.status(400).json({
        success: false,
        message: "Message cannot exceed 5000 characters",
      });
      return;
    }

    const conversation = await getConversationForParticipant(
      conversationId,
      req.user.userId,
    );

    if (!conversation) {
      res.status(403).json({
        success: false,
        message: "You are not allowed to send messages in this conversation",
      });
      return;
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user.userId,
      content: content.trim(),
      messageType: "text",
    });

    conversation.lastMessage = message._id;
    conversation.lastMessageAt = message.createdAt;

    await conversation.save();

    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "firstName lastName role",
    );

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};
