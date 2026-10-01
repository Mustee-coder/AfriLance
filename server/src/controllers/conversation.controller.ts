import type { Response } from "express";
import { Types } from "mongoose";
import { Conversation } from "../models/conversation.model.js";
import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const createConversation = async (
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

    const { applicationId } = req.body;

    if (!applicationId || !Types.ObjectId.isValid(applicationId)) {
      res.status(400).json({
        success: false,
        message: "Valid applicationId is required",
      });
      return;
    }

    const application = await Application.findById(applicationId);

    if (!application) {
      res.status(404).json({
        success: false,
        message: "Application not found",
      });
      return;
    }

    const job = await Job.findById(application.job);

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job not found",
      });
      return;
    }

    const userId = req.user.userId;
    const developerId = application.developer.toString();
    const clientId = job.client.toString();

    const isDeveloper = developerId === userId;
    const isClient = clientId === userId;

    if (!isDeveloper && !isClient) {
      res.status(403).json({
        success: false,
        message: "You are not allowed to start this conversation",
      });
      return;
    }

    const participants = [
      application.developer,
      job.client,
    ];

    const existingConversation = await Conversation.findOne({
      application: application._id,
    })
      .populate("participants", "firstName lastName role")
      .populate("job", "title status")
      .populate("application");

    if (existingConversation) {
      res.status(200).json({
        success: true,
        message: "Conversation already exists",
        conversation: existingConversation,
      });
      return;
    }

    const conversation = await Conversation.create({
      application: application._id,
      job: job._id,
      participants,
    });

    const populatedConversation = await Conversation.findById(
      conversation._id,
    )
      .populate("participants", "firstName lastName role")
      .populate("job", "title status")
      .populate("application");

    res.status(201).json({
      success: true,
      message: "Conversation created successfully",
      conversation: populatedConversation,
    });
  } catch (error) {
    console.error("Create conversation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create conversation",
    });
  }
};

export const getMyConversations = async (
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

    const conversations = await Conversation.find({
      participants: req.user.userId,
    })
      .populate("participants", "firstName lastName role")
      .populate("job", "title status")
      .populate("application")
      .sort({ lastMessageAt: -1, updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
    });
  }
};

export const getConversationById = async (
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

    const id = req.params.id as string;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
      return;
    }

    const conversation = await Conversation.findById(id)
      .populate("participants", "firstName lastName role")
      .populate("job", "title status")
      .populate("application");

    if (!conversation) {
      res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
      return;
    }

    const isParticipant = conversation.participants.some(
      (participant) => participant._id.toString() === req.user!.userId,
    );

    if (!isParticipant) {
      res.status(403).json({
        success: false,
        message: "You are not a participant in this conversation",
      });
      return;
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Get conversation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch conversation",
    });
  }
};

