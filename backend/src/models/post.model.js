import mongoose from 'mongoose';
const { Schema } = mongoose;


const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  caption: {
    type: String,
    trim: true,
    maxlength: 2200
  },

  mediaUrl: {
    type: String,
    required: true
  },

  mediaType: {
    type: String,
    enum: ["image", "video"],
    required: true
  },

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  likesCount: {
    type: Number,
    default: 0
  },

  commentsCount: {
    type: Number,
    default: 0
  },

  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],

  visibility: {
    type: String,
    enum: ["public", "followers"],
    default: "public"
  },

  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });


postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

export const Post = mongoose.model("Post", postSchema);
