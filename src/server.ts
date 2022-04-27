import Express from "express";
import mongoose from "mongoose";
import { config } from "./config/config";
import { userRouter, getMyFollowers } from "./routes/usersRoute";
import { authRouter } from "./routes/authRoute";
import { postRouter } from "./routes/postRoute";
import { verifySignature } from "./helper/jwt_helper";
import { Server } from "socket.io";
import { createServer } from "http";

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
  const httpServer = createServer(app);
  const io = new Server(httpServer);
  let sockets: { [key: string]: string } = {};

  io.on("connection", (socket) => {
    console.log(`socket connection established`);

    socket.on("newsfeed", (userId) => {
      sockets[userId] = socket.id;
    });
  });

  app.set("view-engine", "ejs");
  app.set("socketio", io);
  app.use([Express.json(), Express.urlencoded()]);
  app.use("/api/auth", authRouter);

  app.use(verifySignature);
  app.use("/api/user", userRouter);
  app.use("/api/post", postRouter);

  httpServer.listen(config.server.SERVER_PORT, () => {
    console.log(`server is connected`);
  });

  const postChangeStream = mongoose.connection.collection("posts").watch();

  postChangeStream.on("change", async (change: any) => {
    switch (change.operationType) {
      case "insert":
        const { userId } = change.fullDocument;
        const myfollowers = await getMyFollowers(userId);

        let filteredSockets = [];
        if (sockets[userId]) filteredSockets.push(sockets[userId]);

        if (myfollowers) {
          myfollowers.map((follower) => {
            if (sockets[follower.toString()])
              filteredSockets.push(sockets[follower.toString()]);
          });
        }

        io.to(filteredSockets).emit("post", change.fullDocument);
        break;
      case "delete":
        break;
    }
  });
};
