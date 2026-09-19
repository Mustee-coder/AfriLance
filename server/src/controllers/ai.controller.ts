import { Request, Response } from "express";

import {
  extractJobRequirementsSchema,
  generateJobSchema,
  improveCVSchema,
} from "../validators/ai.validator.js";

import {
  extractJobRequirements,
  generateJobDraft,
  improveCV,
} from "../services/ai.service.js";

export const generateJob = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validation = generateJobSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid job idea",
        errors: validation.error.flatten(),
      });
      return;
    }

    const draft = await generateJobDraft(validation.data.idea);

    res.status(200).json({
      success: true,
      message: "Job draft generated successfully",
      draft,
    });
  } catch (error) {
    console.error("AI job generation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate job draft",
    });
  }
};

export const extractRequirements = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validation = extractJobRequirementsSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid job idea",
        errors: validation.error.flatten(),
      });
      return;
    }

    const result = await extractJobRequirements(
      validation.data.idea,
    );

    res.status(200).json({
      success: true,
      message: "Job requirements extracted successfully",
      result,
    });
  } catch (error) {
    console.error("AI requirements extraction error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to extract job requirements",
    });
  }
};

export const improveResume = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validation = improveCVSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid resume data",
        errors: validation.error.flatten(),
      });
      return;
    }

    const improvedResume = await improveCV(validation.data);

    res.status(200).json({
      success: true,
      message: "CV improved successfully",
      resume: improvedResume,
    });
  } catch (error) {
    console.error("AI CV improvement error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to improve CV",
    });
  }
};

