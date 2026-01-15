import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getNotifications,
  markRead,
  deleteNotifications
} from "../controllers/notification.controller.js";
import { writeLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

router.route("/").get(verifyJWT, getNotifications);
router.route("/delete").delete(verifyJWT, writeLimiter, deleteNotifications);
router.route("/read").put(verifyJWT, writeLimiter, markRead);


export default router;
