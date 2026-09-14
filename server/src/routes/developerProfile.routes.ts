import { Router } from "express";
import { imageUpload } from "../middleware/upload.middleware.js";
import {
  createDeveloperProfile,
  getMyDeveloperProfile,
  getDeveloperProfileByUserId,
  updateDeveloperProfile,
  deleteDeveloperProfile,
  uploadPortfolioImages,
} from "../controllers/developerProfile.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("developer"),
  createDeveloperProfile,
);

router.get(
  "/me",
  authenticate,
  authorize("developer"),
  getMyDeveloperProfile,
);

router.get(
  "/user/:userId",
  authenticate,
  getDeveloperProfileByUserId,
);

router.patch(
  "/me",
  authenticate,
  authorize("developer"),
  updateDeveloperProfile,
);

router.delete(
  "/me",
  authenticate,
  authorize("developer"),
  deleteDeveloperProfile,
);


router.post(
  "/portfolio/:projectId/images",
  authenticate,
  authorize("developer"),
  imageUpload.array("images", 3),
  uploadPortfolioImages,
);


export default router;
