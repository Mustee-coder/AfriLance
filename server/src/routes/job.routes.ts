import { Router } from "express";

import {
  createJob,
  getJobs,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
  completeJob,
} from "../controllers/job.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

// Anyone authenticated can browse jobs
router.get(
  "/",
  authenticate,
  getJobs,
);

// Client can view their own jobs
router.get(
  "/my",
  authenticate,
  authorize("client"),
  getMyJobs,
);

// Only clients can mark their own in-progress jobs as completed
router.patch(
  "/:id/complete",
  authenticate,
  authorize("client"),
  completeJob,
);

// Anyone authenticated can view a single job
router.get(
  "/:id",
  authenticate,
  getJobById,
);

// Only clients can create jobs
router.post(
  "/",
  authenticate,
  authorize("client"),
  createJob,
);

// Only the job owner can update/delete
// Ownership is checked inside the controller
router.patch(
  "/:id",
  authenticate,
  authorize("client"),
  updateJob,
);

router.delete(
  "/:id",
  authenticate,
  authorize("client"),
  deleteJob,
);

export default router;