import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createReel, getReels, getReelFeed, deleteReel } from "../controllers/reel.controller.js";


const router = express.Router();

router.route("/feed").get(verifyJWT, getReelFeed);
router.route("/create").post(verifyJWT, upload.single("video"), createReel);
router.route("/:userId").get(getReels);
router.route("/delete/:reelId").delete(verifyJWT, deleteReel);

export default router;
