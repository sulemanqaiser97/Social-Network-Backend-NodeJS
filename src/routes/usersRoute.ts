import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/user_model";

const userRouter = Router();

//get a user
userRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  }
);

//update user
userRouter.put("/:id", async (req: Request, res: Response) => {
  const { password } = req.body;

  if (password) {
    try {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(password, salt);
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json({ message: `Account updated` });
  } catch (error) {
    return res.status(500).json({ Error: error });
  }
});

//delete user
userRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.body.id);
    res.status(200).json({ message: `Recourse has been deleted` });
  } catch (error) {
    return res.status(500).json({ Error: error });
  }
});

//follow a user
userRouter.put(
  "/:id/follow",
  async (
    req: Request<{ id: String }, {}, { userId: String }>,
    res: Response
  ) => {
    try {
      const user = await User.findById(req.params.id);

      if (user === null)
        return res.status(204).json({ message: `user not found` });

      if (!user.following.includes(req.body.userId)) {
        const toBeFollowed = await User.findById(req.body.userId);
        await user.updateOne({ $push: { following: req.body.userId } });
        await toBeFollowed!.updateOne({ $push: { follower: req.params.id } });

        res.status(200).json({ message: `followed` });
      } else {
        res.status(200).json({ message: `User is already followed by you.` });
      }
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  }
);

//unfollow a user
userRouter.put(
  "/:id/unfollow",
  async (
    req: Request<{ id: String }, {}, { userId: String }>,
    res: Response
  ) => {
    try {
      const user = await User.findById(req.params.id);

      if (user === null)
        return res.status(204).json({ message: `user not found` });

      if (user.following.includes(req.body.userId)) {
        await user.updateOne({ $pull: { following: req.body.userId } });
        console.log("here");

        const tobeRemovedUser = await User.findById(req.body.userId);
        tobeRemovedUser?.updateOne({ $pull: { followers: req.params.id } });

        res.status(200).json({
          message: `User ${tobeRemovedUser?.username} has been unfollowed`,
        });
      } else {
        res.status(200).json({ message: `you are not following this user.` });
      }
    } catch (error) {
      res.status(500).json({ Error: error });
    }
  }
);

//get all followers
const getMyFollowers = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) return [];

    return user.following;
  } catch (error) {}
};

export { userRouter, getMyFollowers };
