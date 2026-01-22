import { Community } from "../models/community.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";

export const createCommunity = async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;

    const exists = await Community.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Community already exists" });
    }

    let coverImageUrl = "";

    if (req.file) {
      const upload = await uploadonCloudinary(req.file.path);
      coverImageUrl = upload?.secure_url;
    }

    const community = await Community.create({
      name,
      description,
      coverImage: coverImageUrl,
      creator: req.user._id,
      admins: [req.user._id],
      members: [req.user._id],
      membersCount: 1,
      isPrivate
    });

    res.status(201).json(community);
  } catch (error) {
    res.status(500).json({ message: "Create community failed", error });
  }
};

export const joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (community.members.includes(req.user._id)) {
      return res.status(400).json({ message: "Already joined" });
    }

    if (community.isPrivate) {
      if (!community.joinRequests.includes(req.user._id)) {
        community.joinRequests.push(req.user._id);
        await community.save();
      }
      return res.json({ message: "Join request sent" });
    }

    community.members.push(req.user._id);
    community.membersCount += 1;
    await community.save();

    res.json({ message: "Joined community" });
  } catch (error) {
    res.status(500).json({ message: "Join failed", error });
  }
};

export const approveJoinRequest = async (req, res) => {
  try {
    const { userId } = req.body;
    const community = await Community.findById(req.params.id);

    if (!community.admins.includes(req.user._id)) {
      return res.status(403).json({ message: "Not admin" });
    }

    community.joinRequests = community.joinRequests.filter(
      id => id.toString() !== userId
    );

    community.members.push(userId);
    community.membersCount += 1;

    await community.save();
    res.json({ message: "User added to community" });
  } catch (error) {
    res.status(500).json({ message: "Approval failed", error });
  }
};

export const makeAdmin = async (req, res) => {
  try {
    const { userId } = req.body;
    const community = await Community.findById(req.params.id);

    if (community.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only creator can assign admins" });
    }

    if (!community.admins.includes(userId)) {
      community.admins.push(userId);
    }

    await community.save();
    res.json({ message: "User promoted to admin" });
  } catch (error) {
    res.status(500).json({ message: "Admin promotion failed", error });
  }
};

export const leaveCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    community.members = community.members.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    community.membersCount -= 1;
    await community.save();

    res.json({ message: "Left community" });
  } catch (error) {
    res.status(500).json({ message: "Leave failed", error });
  }
};

export const getCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate("creator", "username avatar")
      .populate("admins", "username")
      .populate("members", "username avatar");

    res.json(community);
  } catch (error) {
    res.status(500).json({ message: "Fetch failed", error });
  }
};
