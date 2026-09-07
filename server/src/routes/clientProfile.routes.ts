import { Router } from "express";

import {
  createClientProfile,
  getMyClientProfile,
  updateClientProfile,
  deleteClientProfile,
  getClientProfileByUserId,
} from "../controllers/clientProfile.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("client"),
  createClientProfile,
);

router.get(
  "/me",
  authenticate,
  authorize("client"),
  getMyClientProfile,
);

router.patch(
  "/me",
  authenticate,
  authorize("client"),
  updateClientProfile,
);

router.delete(
  "/me",
  authenticate,
  authorize("client"),
  deleteClientProfile,
);

router.get(
  "/user/:userId",
  authenticate,
  getClientProfileByUserId,
);

export default router;
