import { Router } from "express";

import {
  createResume,
  getMyResume,
  updateMyResume,
  getPublicResume,
} from "../controllers/resume.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();



router.get(
  "/public/:slug",
  getPublicResume,
);


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
