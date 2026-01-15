import express from "express";
import { createStory, getStories, deleteStory } from "../controllers/story.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = express.Router();

router.route("/create").post(verifyJWT, upload.single("media"), createStory);
router.route("/user/:userId").get(getStories);
router.route("/:storyId").delete(verifyJWT, deleteStory);

export default router;
