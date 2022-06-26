import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import { boolean, date } from "joi";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  followers: String[];
  following: String[];
  subscriptionEnabled: boolean;
}

const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    follower: {
      type: [
        {
          type: String,
        },
      ],
      default: [],
    },
    following: {
      type: [
        {
          type: String,
        },
      ],
      default: [],
    },
    subscriptionEnabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error: any) {
    console.error(error);
    return;
  }
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
