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
exports.userRouter = void 0;
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
//get a user
userRouter.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.id);
        res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ Error: error });
    }
}));
//update user
userRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    if (password) {
        try {
            const salt = yield bcrypt_1.default.genSalt(10);
            req.body.password = yield bcrypt_1.default.hash(password, salt);
        }
        catch (error) {
            return res.status(500).json({ Error: error });
        }
    }
    try {
        const user = yield User_1.default.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        });
        res.status(200).json({ message: `Account updated` });
    }
    catch (error) {
        return res.status(500).json({ Error: error });
    }
}));
//delete user
userRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User_1.default.findByIdAndDelete(req.body.id);
        res.status(200).json({ message: `Recourse has been deleted` });
    }
    catch (error) {
        return res.status(500).json({ Error: error });
    }
}));
//follow a user
userRouter.put("/:id/follow", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.id);
        if (user === null)
            return res.status(204).json({ message: `user not found` });
        if (!user.following.includes(req.body.userId)) {
            const toBeFollowed = yield User_1.default.findById(req.body.userId);
            yield user.updateOne({ $push: { following: req.body.userId } });
            yield toBeFollowed.updateOne({ $push: { follower: req.params.id } });
            res.status(200).json({ message: `followed` });
        }
        else {
            res.status(200).json({ message: `User is already followed by you.` });
        }
    }
    catch (error) {
        return res.status(500).json({ Error: error });
    }
}));
//unfollow a user
userRouter.put("/:id/unfollow", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.id);
        if (user === null)
            return res.status(204).json({ message: `user not found` });
        if (user.following.includes(req.body.userId)) {
            yield user.updateOne({ $pull: { following: req.body.userId } });
            console.log("here");
            const tobeRemovedUser = yield User_1.default.findById(req.body.userId);
            tobeRemovedUser === null || tobeRemovedUser === void 0 ? void 0 : tobeRemovedUser.updateOne({ $pull: { followers: req.params.id } });
            res.status(200).json({
                message: `User ${tobeRemovedUser === null || tobeRemovedUser === void 0 ? void 0 : tobeRemovedUser.username} has been unfollowed`,
            });
        }
        else {
            res.status(200).json({ message: `you are not following this user.` });
        }
    }
    catch (error) {
        res.status(500).json({ Error: error });
    }
}));
