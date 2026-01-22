import { Community } from "../models/community.model.js";
import { CommunityPost } from "../models/communityPost.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";

export const createCommunityPost = async (req, res) => {
  try {
    const { text } = req.body;
    const { communityId } = req.params;

    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (!community.members.includes(req.user._id)) {
      return res.status(403).json({ message: "Not a community member" });
    }

    let mediaUrl = "";

    if (req.file) {
      const upload = await uploadonCloudinary(req.file.path);
      mediaUrl = upload?.secure_url;
    }

    const post = await CommunityPost.create({
      community: communityId,
      author: req.user._id,
      text,
      mediaUrl
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Post failed", error });
  }
};

export const getCommunityFeed = async (req, res) => {
  try {
    const posts = await CommunityPost.find({
      community: req.params.communityId
    })
      .populate("author", "username avatar")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Feed failed", error });
  }
};

export const likeCommunityPost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id.toString();

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ likesCount: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Like failed", error });
  }
};

export const deleteCommunityPost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.postId);
    const community = await Community.findById(post.community);

    if (
      post.author.toString() !== req.user._id.toString() &&
      !community.admins.includes(req.user._id)
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error });
  }
};
