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

  const userIds = [...followingIds, userId];

  const posts = await Post.find({
    user: { $in: userIds },
    isDeleted: false
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("user", "username avatar isVerified");

  const totalCount = await Post.countDocuments({
    user: { $in: userIds },
    isDeleted: false
  });

  const totalPages = Math.ceil(totalCount / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return res.status(200).json(
    new ApiResponse(200, {
      posts,
      page,
      totalPages,
      hasNext,
      hasPrev
    })
  );
});


export { getHomeFeed };