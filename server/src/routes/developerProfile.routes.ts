import { Router } from "express";
import {
  createDeveloperProfile,
  getMyDeveloperProfile,
  getDeveloperProfileByUserId,
  updateDeveloperProfile,
  deleteDeveloperProfile,
} from "../controllers/developerProfile.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("developer"),
  createDeveloperProfile,
);

router.get(
  "/me",
  authenticate,
  authorize("developer"),
  getMyDeveloperProfile,
);

router.get(
  "/user/:userId",
  authenticate,
  getDeveloperProfileByUserId,
);

router.patch(
  "/me",
  authenticate,
  authorize("developer"),
  updateDeveloperProfile,
);

router.delete(
  "/me",
  authenticate,
  authorize("developer"),
  deleteDeveloperProfile,
);

export default router;
