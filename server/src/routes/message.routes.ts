import { Router } from "express";
import {
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/:id/messages", getMessages);
router.post("/:id/messages", sendMessage);

export default router;
