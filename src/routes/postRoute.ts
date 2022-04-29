import { Router, Request, Response } from "express";
import { finished } from "stream";
import Post from "../models/post_model";
import User from "../models/user_model";

const postRouter = Router();

//create a Post
postRouter.post("/", async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.userId);

    const newPost = new Post({ ...req.body, username: user?.username });
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
postRouter.get(
  "/timeline/user/:id",
  async (
    req: Request<
      { id: string },
      {},
      {},
      { pageNo: string; size: string; order: string }
    >,
    res: Response
  ) => {
    try {
      let pageNo = 1;
      let size = 10;
      let order = "desc";

      if (req.query.pageNo) pageNo = parseInt(req.query.pageNo);
      if (req.query.size) size = parseInt(req.query.size);
      if (req.query.order) order = req.query.order;

      const query = {
        start_index: size * (pageNo - 1),
        end_index: size + size * (pageNo - 1),
      };

      const currentUser = await User.findById(req.params.id);
      if (currentUser) {
        let friendPosts = await Promise.all(
          currentUser?.following.map((friendId) => {
            return Post.find({ userId: friendId });
          })
        );

        if (friendPosts) {
          let filtered_posts: any = friendPosts[0];

          if (order === "desc") {
            filtered_posts.sort(
              (a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime()
            );
          } else {
            filtered_posts.sort(
              (a: any, b: any) => a.createdAt.getTime() - b.createdAt.getTime()
            );
          }
          filtered_posts = filtered_posts.slice(
            query.start_index,
            query.end_index
          );
          return res.status(200).json(filtered_posts);
        }

        res.status(204);
      } else {
        res.status(404).json({ message: `user not foud` });
      }
    } catch (error) {}
  }
);

export { postRouter };
