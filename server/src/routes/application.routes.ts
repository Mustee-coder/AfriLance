import { Router } from "express";
import {
  createApplication,
  getMyApplications,
  getApplicationById,
  withdrawApplication,
  getJobApplications,
  updateApplicationStatus,
} from "../controllers/application.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

// Developer
router.post(
  "/",
  authenticate,
  authorize("developer"),
  createApplication,
);

router.get(
  "/my",
  authenticate,
  authorize("developer"),
  getMyApplications,
);

router.delete(
  "/:id",
  authenticate,
  authorize("developer"),
  withdrawApplication,
);

// Developer + Client
router.get(
  "/:id",
  authenticate,
  getApplicationById,
);

// Client
router.get(
  "/job/:jobId",
  authenticate,
  authorize("client"),
  getJobApplications,
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("client"),
  updateApplicationStatus,
);

export default router;
