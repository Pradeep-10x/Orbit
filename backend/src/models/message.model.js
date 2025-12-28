import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    content: String,
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);


messageSchema.index({ conversation: 1, createdAt: 1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ receiver: 1 });

export const Message = mongoose.model("Message", messageSchema);
