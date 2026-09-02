import { Router } from "express";

import {
  getDeveloperDashboard,
  getClientDashboard,
} from "../controllers/dashboard.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.get(
  "/developer",
  authenticate,
  authorize("developer"),
  getDeveloperDashboard,
);

router.get(
  "/client",
  authenticate,
  authorize("client"),
  getClientDashboard,
);

export default router;