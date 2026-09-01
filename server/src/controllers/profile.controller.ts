import type { Response } from "express";
import { Profile } from "../models/profile.model.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { updateProfileSchema } from "../validators/profile.validator.js";

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
    new: true,
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
