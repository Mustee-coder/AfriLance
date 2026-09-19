import { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import {
  createResumeSchema,
  updateResumeSchema,
} from "../validators/resume.validator.js";

import { Resume } from "../models/resume.model.js";

export const createResume = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const validation = createResumeSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid resume data",
        errors: validation.error.flatten(),
      });
      return;
    }

    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const existingResume = await Resume.findOne({
      user: userId,
    });

    if (existingResume) {
      res.status(409).json({
        success: false,
        message: "Resume already exists",
      });
      return;
    }

    const resume = await Resume.create({
      user: userId,
      ...validation.data,
    });

    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume,
    });
  } catch (error) {
    console.error("Create resume error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create resume",
    });
  }
};

export const getMyResume = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const resume = await Resume.findOne({
      user: userId,
    });

    if (!resume) {
      res.status(404).json({
        success: false,
        message: "Resume not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Get resume error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get resume",
    });
  }
};


export const updateMyResume = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const validation = updateResumeSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid resume data",
        errors: validation.error.flatten(),
      });
      return;
    }

    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const resume = await Resume.findOneAndUpdate(
      { user: userId },
      validation.data,
    {
  returnDocument: "after",
  runValidators: true,
},
    );

    if (!resume) {
      res.status(404).json({
        success: false,
        message: "Resume not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      resume,
    });
  } catch (error) {
    console.error("Update resume error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update resume",
    });
  }
};

