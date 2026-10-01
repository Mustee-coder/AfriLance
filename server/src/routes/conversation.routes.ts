import { Router } from "express";
import {
  createConversation,
  getMyConversations,
  getConversationById,
} from "../controllers/conversation.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", createConversation);
router.get("/", getMyConversations);
router.get("/:id", getConversationById);

export default router;