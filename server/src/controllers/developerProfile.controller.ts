import { Response } from "express";
import mongoose from "mongoose";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { DeveloperProfile } from "../models/developerProfile.model.js";
import {
  createDeveloperProfileSchema,
  updateDeveloperProfileSchema,
} from "../validators/developerProfile.validator.js";

export const createDeveloperProfile = async (
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

    const parsed = createDeveloperProfileSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const existingProfile = await DeveloperProfile.findOne({
      user: req.user.userId,
    });

    if (existingProfile) {
      res.status(409).json({
        success: false,
        message: "Developer profile already exists",
      });
      return;
    }

    const profile = await DeveloperProfile.create({
      user: req.user.userId,
      ...parsed.data,
    });

    res.status(201).json({
      success: true,
      message: "Developer profile created successfully",
      profile,
    });
  } catch (error) {
    console.error("Create developer profile error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMyDeveloperProfile = async (
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

    const profile = await DeveloperProfile.findOne({
      user: req.user.userId,
    }).populate("user", "firstName lastName email role");

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Developer profile not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get developer profile error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateDeveloperProfile = async (
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

    const parsed = updateDeveloperProfileSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const profile = await DeveloperProfile.findOne({
      user: req.user.userId,
    });

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Developer profile not found",
      });
      return;
    }

    Object.assign(profile, parsed.data);

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Developer profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update developer profile error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteDeveloperProfile = async (
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

    const profile = await DeveloperProfile.findOneAndDelete({
      user: req.user.userId,
    });

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Developer profile not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Developer profile deleted successfully",
    });
  } catch (error) {
    console.error("Delete developer profile error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getDeveloperProfileByUserId = async (
req: AuthenticatedRequest,
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

const profile = await DeveloperProfile.findOne({ user: userId }).populate(  
  "user",  
  "firstName lastName  role",  
);  

if (!profile) {  
  res.status(404).json({  
    success: false,  
    message: "Developer profile not found",  
  });  
  return;  
}  

res.status(200).json({  
  success: true,  
  profile,  
});

} catch (error) {
console.error("Get developer profile by user ID error:", error);

res.status(500).json({  
  success: false,  
  message: "Internal server error",  
});

}
};


