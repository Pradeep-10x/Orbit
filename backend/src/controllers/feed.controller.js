import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Follow } from "../models/follow.model.js";
import { Post } from "../models/post.model.js";

 const getHomeFeed = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const followingIds = await Follow.find({ follower: userId })
    .distinct("following");

  followingIds.push(userId);

  // 3️⃣ fetch posts
  const posts = await Post.find({
    user: { $in: followingIds },
    isDeleted: false
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("user", "username avatar isVerified");

  return res.status(200).json(
    new ApiResponse(200, {
      posts,
      page
    })
  );
});


export { getHomeFeed };