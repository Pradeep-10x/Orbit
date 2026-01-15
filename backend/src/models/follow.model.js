import mongoose from 'mongoose';
const { Schema } = mongoose;

const followSchema = new Schema({
follower :{
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true,
    index : true,
},
following :{
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true,
    index : true,
    }
},{
    timestamps : true,
})
followSchema.index(
  { follower: 1, following: 1 },
  { unique: true }
);

export const Follow = mongoose.model("Follow", followSchema);