import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  sendCommunityMessage,
  getCommunityMessages
} from "../controllers/communityChat.controller.js";

const router = express.Router();

router.post("/:communityId", verifyJWT, sendCommunityMessage);
router.get("/:communityId", verifyJWT, getCommunityMessages);

export default router;

