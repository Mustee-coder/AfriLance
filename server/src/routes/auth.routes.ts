import { Router } from "express";
import {
  forgotPassword,
  getMe,
  login,
  logout,
  register,
  resetPassword,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.post(
  "/forgot-password",
  forgotPassword,
);

router.post(
  "/reset-password",
  resetPassword,
);

router.get(
  "/me",
  authenticate,
  getMe,
);



export default router;
