import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  sendMessage,
  getConversations,
  getMessages
} from "../controllers/message.controller.js";
import { writeLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();
router.route("/send").post(verifyJWT, writeLimiter, sendMessage);
router.route("/conversations").get(verifyJWT, getConversations);
router.route("/conversation/:conversationId/messages").get(verifyJWT, getMessages);

export default router;
