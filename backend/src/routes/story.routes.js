import express from "express";
import { createStory, getStories, deleteStory, getStoryFeed } from "../controllers/story.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = express.Router();

router.route("/create").post(verifyJWT, upload.single("media"), createStory);
router.route("/feed").get(verifyJWT, getStoryFeed);
router.route("/user/:userId").get(getStories);
// View story route
router.route("/:storyId").delete(verifyJWT, deleteStory);

export default router;
