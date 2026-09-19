import { Router } from "express";

import {
  createResume,
  getMyResume,
  updateMyResume,
} from "../controllers/resume.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  createResume,
);

router.get(
  "/me",
  authenticate,
  getMyResume,
);

router.put(
  "/me",
  authenticate,
  updateMyResume,
);

export default router;