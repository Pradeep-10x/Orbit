import mongoose from "mongoose";

const reelSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    videoUrl: {
      type: String,
      required: true
    },
    caption: String,
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Reel = mongoose.model("Reel", reelSchema);
