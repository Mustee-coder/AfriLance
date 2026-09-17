import { Router } from "express";

import {
  extractRequirements,
  generateJob,
} from "../controllers/ai.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/generate-job",
  authenticate,
  generateJob,
);

router.post(
  "/extract-requirements",
  authenticate,
  extractRequirements,
);

export default router;