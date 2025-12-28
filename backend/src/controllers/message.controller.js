import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { emitToUser } from '../utils/socketEmitters.js';

 const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content } = req.body;

  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, receiverId] }
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user._id, receiverId]
    });
  }

  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    receiver: receiverId,
    content
  });
emitToUser(req, receiverId, "message:new", message);
  conversation.lastMessage = content;
  await conversation.save();

  res.status(201).json(new ApiResponse(201, message));
});

const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user._id
  }).populate("participants", "username avatar");

  res.status(200).json(new ApiResponse(200, conversations));
});

const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    conversation: req.params.conversationId
  }).sort({ createdAt: 1 });

  res.status(200).json(new ApiResponse(200, messages));
});

export { sendMessage, getConversations, getMessages };