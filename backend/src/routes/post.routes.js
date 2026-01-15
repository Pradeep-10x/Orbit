import express from "express";
import { createPost ,getUserPosts,getSinglePost,deletePost} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { writeLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

router.route("/create").post(verifyJWT, writeLimiter, upload.single("media"), createPost);
router.route("/user/:userId").get(getUserPosts);
router.route("/:postId").get(getSinglePost);
router.route("/:postId").delete(verifyJWT, writeLimiter, deletePost);

export default router;
