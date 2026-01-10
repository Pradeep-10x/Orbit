import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
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

    likesCount: {
      type: Number,
      default: 0
    },

    isDeleted: {
      type: Boolean,
      default: false
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 86400
    }
  }
);

export const Story = mongoose.model("Story", storySchema);