import Express from "express";
import mongoose from "mongoose";
import { config } from "./config/config";
import { userRouter } from "./routes/usersRoute";
import { authRouter } from "./routes/authRoute";
import { postRouter } from "./routes/postRoute";
import { verifySignature } from "./helper/jwt_helper";

mongoose
  .connect(config.mongo.MONGO_URL, {
    retryWrites: true,
    w: "majority",
  })
  .then(() => {
    console.log(`Database is connected`);
    startServer();
  })
  .catch((err) => {
    console.error(err);
  });

const startServer = () => {
  const app = Express();
  app.use([Express.json(), Express.urlencoded()]);
  app.use("/api/auth", authRouter);

  app.use(verifySignature);
  app.use("/api/user", userRouter);
  app.use("/api/post", postRouter);

  app.listen(3012, () => {
    console.log(`server is connected`);
  });
};
