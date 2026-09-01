import { Router } from "express";
import {
getProfile,
updateProfile,
} from "../controllers/profile.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getProfile);
router.patch("/", authenticate, updateProfile);

export default router;
