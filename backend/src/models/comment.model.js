import mongoose from "mongoose";
const { Schema} = mongoose;
import { Post } from "./post.model.js";
import { User } from "./user.model.js";
import { Reel } from "./reel.model.js";

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

export const Comment = mongoose.model("Comment", commentSchema);
 