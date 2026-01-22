import { CommunityPost } from "../models/communityPost.model.js";
import { CommunityComment } from "../models/communityComment.model.js";

export const addCommunityComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await CommunityPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await CommunityComment.create({
      post: post._id,
      author: req.user._id,
      text
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Comment failed", error });
  }
};

export const getCommunityComments = async (req, res) => {
  try {
    const comments = await CommunityComment.find({
      post: req.params.postId
    })
      .populate("author", "username avatar")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Fetch comments failed", error });
  }
};
