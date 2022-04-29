import mongoose, { Schema, Document } from "mongoose";

export interface IModerator extends Document {
  userId: String;
  username: string;
}

const moderatorSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Moderator = mongoose.model<IModerator>("moderators", moderatorSchema);
export default Moderator;
