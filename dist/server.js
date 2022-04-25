"use strict";
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
    app.use([express_1.default.json(), express_1.default.urlencoded()]);
    app.use("/api/auth", authRoute_1.authRouter);
    app.use(jwt_helper_1.verifySignature);
    app.use("/api/user", usersRoute_1.userRouter);
    app.use("/api/post", postRoute_1.postRouter);
    app.listen(3012, () => {
        console.log(`server is connected`);
    });
};
