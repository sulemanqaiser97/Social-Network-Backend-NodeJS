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
exports.postRouter = void 0;
const express_1 = require("express");
const post_model_1 = __importDefault(require("../models/post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
const postRouter = (0, express_1.Router)();
exports.postRouter = postRouter;
//create a Post
postRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPost = new post_model_1.default(req.body);
        const savedPost = yield newPost.save();
        res.status(200).send(savedPost);
    }
    catch (error) {
        return res.status(500).send({ Error: error });
    }
}));
//Update a Post
postRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.default.findById(req.params.id);
        if (post) {
            const updatedPost = yield post.updateOne({ $set: req.body });
            res.status(200).json(updatedPost);
        }
        else {
            return res.status(204).json({ message: `Resource was not found` });
        }
    }
    catch (error) {
        res.status(500).json({ Error: error });
    }
}));
//delete a post
postRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield post_model_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: `The post has been deleted` });
    }
    catch (error) {
        res.status(500).json({ Error: error });
    }
}));
//get a post
postRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.default.findById(req.params.id);
        console.log(post);
        if (post) {
            res.status(200).json(post);
        }
        else {
            res.status(204).json({ message: `resource not found` });
        }
    }
    catch (error) {
        res.status(500).json({ Error: error });
    }
}));
//get Timeline Post
postRouter.get("/timeline/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = yield user_model_1.default.findById(req.params.id);
        if (currentUser) {
            const friendPosts = yield Promise.all(currentUser === null || currentUser === void 0 ? void 0 : currentUser.following.map((friendId) => {
                return post_model_1.default.find({ userId: friendId });
            }));
            if (friendPosts)
                return res.status(200).json(friendPosts[0]);
            res.status(204);
        }
        else {
            res.status(404).json({ message: `user not foud` });
        }
    }
    catch (error) { }
}));
