import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getNotifications,
  markRead,
  deleteNotifications
} from "../controllers/notification.controller.js";


const router = express.Router();

router.route("/").get(verifyJWT, getNotifications);
router.route("/delete").delete(verifyJWT, deleteNotifications);
router.route("/read").put(verifyJWT, markRead);


export default router;
