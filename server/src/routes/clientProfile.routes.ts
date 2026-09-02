import { Router } from "express";

import {
  createClientProfile,
  getMyClientProfile,
  getClientProfileByUserId,
  updateClientProfile,
  deleteClientProfile,
} from "../controllers/clientProfile.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

// Create client profile
router.post(
  "/",
  authenticate,
  authorize("client"),
  createClientProfile,
);

// Get my client profile
router.get(
  "/me",
  authenticate,
  authorize("client"),
  getMyClientProfile,
);

// Get client profile by user ID
router.get(
  "/user/:userId",
  authenticate,
  getClientProfileByUserId,
);

// Update my client profile
router.patch(
  "/me",
  authenticate,
  authorize("client"),
  updateClientProfile,
);

// Delete my client profile
router.delete(
  "/me",
  authenticate,
  authorize("client"),
  deleteClientProfile,
);

export default router;
