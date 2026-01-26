import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { CommunityChat } from '../models/communityChat.model.js';
import { Community } from '../models/community.model.js';
import { emitToCommunity } from '../utils/socketEmitters.js';
import mongoose from 'mongoose';

// Send message to community chat
export const sendCommunityMessage = asyncHandler(async (req, res) => {
  const { communityId } = req.params;
  const { content } = req.body;

  if (!content || !content.trim()) {
    throw new ApiError(400, "Message content is required");
  }

  if (!mongoose.Types.ObjectId.isValid(communityId)) {
    throw new ApiError(400, "Invalid community ID");
  }

  // Check if community exists and user is a member
  const community = await Community.findById(communityId);
  if (!community) {
    throw new ApiError(404, "Community not found");
  }

  const isMember = community.members.some(m => m.toString() === req.user._id.toString());
  const isAdmin = community.admins.some(a => a.toString() === req.user._id.toString());
  const isCreator = community.creator.toString() === req.user._id.toString();

  if (!isMember && !isAdmin && !isCreator) {
    throw new ApiError(403, "You must be a member to send messages in this community");
  }

  // Create community chat message
  const message = await CommunityChat.create({
    community: communityId,
    sender: req.user._id,
    content: content.trim()
  });

  // Populate sender before emitting
  const populatedMessage = await CommunityChat.findById(message._id)
    .populate('sender', 'username avatar fullName');

  // Prepare message data for response and socket
  const messageData = {
    _id: populatedMessage._id,
    sender: {
      _id: populatedMessage.sender._id,
      username: populatedMessage.sender.username,
      avatar: populatedMessage.sender.avatar,
      fullName: populatedMessage.sender.fullName
    },
    content: populatedMessage.content,
    community: communityId,
    createdAt: populatedMessage.createdAt
  };

  // Emit to all community members via WebSocket
  await emitToCommunity(req, communityId, "community:message:new", messageData);

  res.status(201).json(new ApiResponse(201, messageData, "Message sent successfully"));
});

// Get community chat messages
export const getCommunityMessages = asyncHandler(async (req, res) => {
  const { communityId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  if (!mongoose.Types.ObjectId.isValid(communityId)) {
    throw new ApiError(400, "Invalid community ID");
  }

  // Check if community exists and user is a member
  const community = await Community.findById(communityId);
  if (!community) {
    throw new ApiError(404, "Community not found");
  }

  const isMember = community.members.some(m => m.toString() === req.user._id.toString());
  const isAdmin = community.admins.some(a => a.toString() === req.user._id.toString());
  const isCreator = community.creator.toString() === req.user._id.toString();

  if (!isMember && !isAdmin && !isCreator) {
    throw new ApiError(403, "You must be a member to view messages in this community");
  }

  // Get messages
  const messages = await CommunityChat.find({
    community: communityId
  })
    .populate('sender', 'username avatar fullName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalCount = await CommunityChat.countDocuments({ community: communityId });

  // Reverse to show oldest first
  const reversedMessages = messages.reverse();

  res.status(200).json(new ApiResponse(200, {
    messages: reversedMessages,
    page,
    totalPages: Math.ceil(totalCount / limit),
    hasNext: page < Math.ceil(totalCount / limit),
    hasPrev: page > 1
  }));
});

