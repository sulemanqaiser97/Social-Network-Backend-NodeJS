import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  userId: String;
  description: String;
}

const PostSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model<IPost>("Post", PostSchema);

export default Post;
