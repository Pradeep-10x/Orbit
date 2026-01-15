import {Router} from 'express';
import { likeUnlikePost,getPostLikes,likeUnlikeReel,getReelLikes, likeUnlikeStory,getStoryLikes} from '../controllers/like.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { writeLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

router.route('post/:postId').post(verifyJWT, likeUnlikePost);
router.route('post/:postId').get(getPostLikes);

router.route('reel/:reelId').post(verifyJWT, likeUnlikeReel);
router.route('reel/:reelId').get(getReelLikes);

router.route("/story/:storyId").post(verifyJWT, writeLimiter, likeUnlikeStory);
router.route("/story/:storyId").get(verifyJWT, getStoryLikes);
export default router;