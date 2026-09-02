import { Request, Response } from "express";
import mongoose from "mongoose";
import { ClientProfile } from "../models/clientProfile.model.js";
import {
  createClientProfileSchema,
  updateClientProfileSchema,
} from "../validators/clientProfile.validator.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const createClientProfile = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const validation = createClientProfileSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const existingProfile = await ClientProfile.findOne({
      user: req.user!.userId,
    });

    if (existingProfile) {
      res.status(409).json({
        success: false,
        message: "Client profile already exists",
      });
      return;
    }

    const profile = await ClientProfile.create({
      user: req.user!.userId,
      ...validation.data,
    });

    res.status(201).json({
      success: true,
      message: "Client profile created successfully",
      profile,
    });
  } catch (error) {
    console.error("Create client profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create client profile",
    });
  }
};

export const getMyClientProfile = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const profile = await ClientProfile.findOne({
      user: req.user!.userId,
    }).populate("user", "firstName lastName email role");

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Client profile not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get my client profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get client profile",
    });
  }
};

export const updateClientProfile = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const validation = updateClientProfileSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const profile = await ClientProfile.findOne({
      user: req.user!.userId,
    });

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Client profile not found",
      });
      return;
    }

    Object.assign(profile, validation.data);

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Client profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update client profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update client profile",
    });
  }
};

export const deleteClientProfile = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const profile = await ClientProfile.findOne({
      user: req.user!.userId,
    });

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Client profile not found",
      });
      return;
    }

    await profile.deleteOne();

    res.status(200).json({
      success: true,
      message: "Client profile deleted successfully",
    });
  } catch (error) {
    console.error("Delete client profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete client profile",
    });
  }
};

export const getClientProfileByUserId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = Array.isArray(req.params.userId)
      ? req.params.userId[0]
      : req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    const profile = await ClientProfile.findOne({
      user: userId,
    }).populate("user", "firstName lastName role");

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Client profile not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get client profile by user ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get client profile",
    });
  }
};
