import mongoose from "mongoose";
const { Schema} = mongoose;

const commentSchema= new Schema({
     post : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: null,
        index: true,
     },
         reel : {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Reel",
         default: null,
         index: true,
     },
     
     user :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
     },

     content : {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
     },

     isDeleted : {
        type: Boolean,
        default: false,
     },
}, { timestamps: true });

commentSchema.pre('validate', function(next) {
  if (!this.post && !this.reel) {
    next(new Error('Comment must be associated with either a post or a reel'));
  } else if (this.post && this.reel) {
    next(new Error('Comment cannot be associated with both a post and a reel'));
  } else {
    next();
  }
});

export const Comment = mongoose.model("Comment", commentSchema);
 