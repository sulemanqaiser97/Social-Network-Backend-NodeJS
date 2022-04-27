import { Router, Request, Response } from "express";
import Post from "../models/post_model";
import User from "../models/user_model";

const postRouter = Router();

//create a Post
postRouter.post("/", async (req: Request, res: Response) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(200).send(savedPost);
  } catch (error) {
    return res.status(500).send({ Error: error });
  }
});

//Update a Post
postRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post) {
      const updatedPost = await post.updateOne({ $set: req.body });
      res.status(200).json(updatedPost);
    } else {
      return res.status(204).json({ message: `Resource was not found` });
    }
  } catch (error) {
    res.status(500).json({ Error: error });
  }
});

//delete a post
postRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `The post has been deleted` });
  } catch (error) {
    res.status(500).json({ Error: error });
  }
});

//get a post
postRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(post);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(204).json({ message: `resource not found` });
    }
  } catch (error) {
    res.status(500).json({ Error: error });
  }
});

//get Timeline Post
postRouter.get("/timeline/user/:id", async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findById(req.params.id);
    if (currentUser) {
      const friendPosts = await Promise.all(
        currentUser?.following.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );

      if (friendPosts) return res.status(200).json(friendPosts[0]);
      res.status(204);
    } else {
      res.status(404).json({ message: `user not foud` });
    }
  } catch (error) {}
});

export { postRouter };
