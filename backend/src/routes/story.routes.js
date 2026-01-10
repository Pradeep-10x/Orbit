import express from "express";
import { createStory, getStories, deleteStory } from "../controllers/story.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { writeLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

router.route("/create").post(verifyJWT, writeLimiter, upload.single("media"), createStory);
router.route("/user/:userId").get(getStories);
router.route("/:storyId").delete(verifyJWT, writeLimiter, deleteStory);

export default router;
