"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config/config");
const usersRoute_1 = require("./routes/usersRoute");
const authRoute_1 = require("./routes/authRoute");
const postRoute_1 = require("./routes/postRoute");
const jwt_helper_1 = require("./helper/jwt_helper");
const socket_io_1 = require("socket.io");
const http_1 = require("http");
mongoose_1.default
    .connect(config_1.config.mongo.MONGO_URL, {
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
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    const io = new socket_io_1.Server(httpServer);
    let sockets = {};
    io.on("connection", (socket) => {
        console.log(`socket connection established`);
        socket.on("newsfeed", (userId) => {
            sockets[userId] = socket.id;
        });
    });
    app.set("view-engine", "ejs");
    app.set("socketio", io);
    app.use([express_1.default.json(), express_1.default.urlencoded()]);
    app.use("/api/auth", authRoute_1.authRouter);
    app.use(jwt_helper_1.verifySignature);
    app.use("/api/user", usersRoute_1.userRouter);
    app.use("/api/post", postRoute_1.postRouter);
    httpServer.listen(config_1.config.server.SERVER_PORT, () => {
        console.log(`server is connected`);
    });
    const postChangeStream = mongoose_1.default.connection.collection("posts").watch();
    postChangeStream.on("change", (change) => __awaiter(void 0, void 0, void 0, function* () {
        switch (change.operationType) {
            case "insert":
                const { userId } = change.fullDocument;
                const myfollowers = yield (0, usersRoute_1.getMyFollowers)(userId);
                let filteredSockets = [];
                if (sockets[userId])
                    filteredSockets.push(sockets[userId]);
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
    }));
};
