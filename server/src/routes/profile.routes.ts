import { Router } from "express";

import {
  getProfile,
  updateProfile,
  uploadAvatar,
  uploadPortfolio,
  uploadFile,
  deletePortfolio,
} from "../controllers/profile.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import {
  upload,
  fileUpload,
} from "../middleware/upload.middleware.js";

const router = Router();

router.get(
  "/",
  authenticate,
  getProfile,
);

router.patch(
  "/",
  authenticate,
  updateProfile,
);

router.post(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  uploadAvatar,
);

router.post(
  "/portfolio",
  authenticate,
  upload.single("image"),
  uploadPortfolio,
);

router.delete(
  "/portfolio/:portfolioId",
  authenticate,
  deletePortfolio,
);




router.post(
  "/file",
  authenticate,
  fileUpload.single("file"),
  uploadFile,
);
export default router;
