import {Router} from 'express';
import {upload} from '../middlewares/multer.middleware.js';
import {registerUser,loginUser,logoutUser,deleteUser,refreshaccessToken,changePassword,GetCurrentUser,updateUserDetails,UpdateAvatar} from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { followUnfollowUser,getFollowers,getFollowing } from '../controllers/follow.controller.js';
import { authLimiter, writeLimiter } from '../middlewares/rateLimiter.middleware.js';



const router = Router();

router.route("/register").post(
    authLimiter,
    upload.fields([
    {
        name : "avatar",
        maxCount : 1,
    }
]), registerUser);

router.route("/login").post(authLimiter, loginUser);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/delete").post(verifyJWT,writeLimiter,deleteUser);
router.route("/refresh-token").post(authLimiter,refreshaccessToken);
router.route("/change-password").post(verifyJWT,authLimiter,changePassword);
router.route("/me").get(verifyJWT,GetCurrentUser);
router.route("/update-details").put(verifyJWT,writeLimiter,updateUserDetails);
router.route("/update-avatar").patch(verifyJWT,writeLimiter,upload.single("avatar"),UpdateAvatar);
router.route("/:userId/follow").post(verifyJWT,writeLimiter, followUnfollowUser);
router.route("/:userId/followers").get(getFollowers);
router.route("/:userId/following").get(getFollowing);
export default router
