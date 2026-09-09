import { Router } from "express";

import {
  createReview,
  getUserReviews,
  getJobReviews,
} from "../controllers/review.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  createReview,
);

router.get(
  "/user/:userId",
  authenticate,
  getUserReviews,
);

router.get(
  "/job/:jobId",
  authenticate,
  getJobReviews,
);

export default router;