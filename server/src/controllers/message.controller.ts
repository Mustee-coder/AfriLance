import type { Response } from "express";
import { Types } from "mongoose";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

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

    const messages = await Message.find({
      conversation: conversation._id,
    })
      .populate("sender", "firstName lastName role")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
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
