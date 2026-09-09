import type { Response } from "express";
import { Profile } from "../models/profile.model.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { updateProfileSchema } from "../validators/profile.validator.js";
import { uploadToCloudinary,  deleteFromCloudinary,  uploadFileToCloudinary } from "../utils/cloudinary.js";
import { createPortfolioSchema } from "../validators/portfolio.validator.js";


export const getProfile = async (
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

const profile = await Profile.findOne({
  userId: req.user.userId,
});

if (!profile) {
  res.status(404).json({
    success: false,
    message: "Profile not found",
  });
  return;
}

res.status(200).json({
  success: true,
  profile,
});

} catch (error) {
console.error("Get profile error:", error);

res.status(500).json({
  success: false,
  message: "Internal server error",
});

}
};

export const updateProfile = async (
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

const result = updateProfileSchema.safeParse(req.body);

if (!result.success) {
  res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: result.error.flatten().fieldErrors,
  });
  return;
}

const profile = await Profile.findOneAndUpdate(
  { userId: req.user.userId },
  {
    $set: result.data,
  },
  {
    returnDocument: "after",
    upsert: true,
    runValidators: true,
  },
);

res.status(200).json({
  success: true,
  message: "Profile updated successfully",
  profile,
});

} catch (error) {
console.error("Update profile error:", error);

res.status(500).json({
  success: false,
  message: "Internal server error",
});

}
};


export const uploadAvatar = async (
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

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "Avatar image is required",
      });
      return;
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      "afrilance/profiles",
    );

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.userId },
      {
        $set: {
          avatar: result.secure_url,
        },
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      avatar: result.secure_url,
      publicId: result.public_id,
      profile,
    });
  } catch (error) {
    console.error("Upload avatar error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload avatar",
    });
  }
};


export const uploadPortfolio = async (
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

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "Portfolio image is required",
      });
      return;
    }

    const result = createPortfolioSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    const { title, description } = result.data;

    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "afrilance/portfolio",
    );

    const portfolioItem = {
      title,
      description,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.userId },
      {
        $push: {
          portfolio: portfolioItem,
        },
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      },
    );

    res.status(201).json({
      success: true,
      message: "Portfolio image uploaded successfully",
      portfolioItem,
      profile,
    });
  } catch (error) {
    console.error("Upload portfolio error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload portfolio image",
    });
  }
};



export const deletePortfolio = async (
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

    const { portfolioId } = req.params;

    if (!portfolioId) {
      res.status(400).json({
        success: false,
        message: "Portfolio ID is required",
      });
      return;
    }

    const profile = await Profile.findOne({
      userId: req.user.userId,
    });

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Profile not found",
      });
      return;
    }

    const portfolioItem = profile.portfolio?.find(
      (item) => item._id?.toString() === portfolioId,
    );

    if (!portfolioItem) {
      res.status(404).json({
        success: false,
        message: "Portfolio item not found",
      });
      return;
    }

    await deleteFromCloudinary(portfolioItem.publicId);

    profile.portfolio = profile.portfolio?.filter(
      (item) => item._id?.toString() !== portfolioId,
    );

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Portfolio image deleted successfully",
    });
  } catch (error) {
    console.error("Delete portfolio error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete portfolio image",
    });
  }
};



export const uploadFile = async (
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

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "File is required",
      });
      return;
    }

    const result = await uploadFileToCloudinary(
      req.file.buffer,
      "afrilance/files",
    );

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file: {
        url: result.secure_url,
        publicId: result.public_id,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error("Upload file error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload file",
    });
  }
};
