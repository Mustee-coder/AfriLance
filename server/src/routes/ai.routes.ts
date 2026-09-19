import { Router } from "express";

import {
  extractRequirements,
  generateJob,
  improveResume,
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

router.post(
  "/improve-cv",
  authenticate,
  improveResume,
);

export default router;