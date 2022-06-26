import { Router, Request, Response } from "express";
import Moderator from "../models/moderator_model";
import Post from "../models/post_model";

const moderatorRouter = Router();

moderatorRouter.post(
  "/add",
  (
    req: Request<{}, {}, { userId: string; username: string }>,
    res: Response
  ) => {
    try {
      const { userId, username } = req.body;
      const moderator = new Moderator({
        userId: userId,
        username: username,
      });

      moderator.save();
      res.status(200).json({ message: `Moderator added.` });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

moderatorRouter.delete("/remove/:id", async (req: Request, res: Response) => {
  try {
    await Moderator.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `user is no longer a moderator` });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

moderatorRouter.put(
  "/updatecontent",
  async (
    req: Request<
      {},
      {},
      { userId: string; postId: string; description: string }
    >,
    res: Response
  ) => {
    try {
      const { userId, postId, description } = req.body;
      const moderator = await Moderator.findOne({ userId: userId });
      if (!moderator)
        return res
          .status(400)
          .json({ message: `user is not a moderator. can't update content` });

      const post = await Post.findById(postId);
      if (!postId)
        return res.status(400).json({ message: `Provide Valid Post Id` });

      const updatedPost = await post?.updateOne({
        $set: { description: description },
      });
      res
        .status(200)
        .json({ message: `post has been updated`, data: updatedPost });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

export { moderatorRouter };
