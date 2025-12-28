import mongoose from "mongoose";
const { Schema} = mongoose;

const likeSchema= new Schema({
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

     story : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Story",
        default: null,
        index: true,
     },
     
     user :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
     },
    }, { timestamps: true });


export const Like = mongoose.model("Like", likeSchema);