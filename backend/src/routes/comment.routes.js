import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPostComment ,getPostComment,deleteComment ,createReelComment,getReelComment} from "../controllers/comment.controller.js";



const router = express.Router();


router.route("/post/:postId").post(verifyJWT, createPostComment);
router.route("/post/:postId").get(getPostComment);

router.route("/reel/:reelId").post(verifyJWT, createReelComment);
router.route("/reel/:reelId").get(getReelComment);

router.route("/:commentId").delete(verifyJWT, deleteComment);
export default router;