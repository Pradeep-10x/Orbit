import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createReel, getReels,deleteReel } from "../controllers/reel.controller.js";
import { writeLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

router.route("/create").post(verifyJWT, writeLimiter, upload.single("video"), createReel);
router.route("/:userId").get(getReels);
router.route("/delete/:reelId").delete(verifyJWT, writeLimiter, deleteReel);

export default router;
