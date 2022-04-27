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
exports.authRouter = void 0;
const express_1 = require("express");
const user_model_1 = __importDefault(require("../models/user_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_helper_1 = require("../helper/jwt_helper");
const validation_schema_1 = require("../helper/validation_schema");
const authRouter = (0, express_1.Router)();
exports.authRouter = authRouter;
authRouter.get("/register", (req, res) => {
    res.render("register.ejs");
});
authRouter.get("/login", (req, res) => {
    res.render("login.ejs");
});
authRouter.post("/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = yield validation_schema_1.authSchemaValidation.validateAsync(req.body);
        const newUser = new user_model_1.default({
            username: username,
            email: email,
            password: password,
        });
        const user = yield newUser.save();
        const accessToken = yield (0, jwt_helper_1.signAccessToken)(user._id.toString());
        res.status(200).json({ user, accessToken });
    }
    catch (error) {
        if (error.isJoi === true)
            return res.status(442).json({ message: error });
        if (error.code === 11000)
            return res
                .status(400)
                .json({ message: `Username/Password already exist.` });
        res.status(500).json({ message: error });
    }
}));
authRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = yield validation_schema_1.loginSchemaValidation.validateAsync(req.body);
        const user = yield user_model_1.default.findOne({ username });
        if (user === null) {
            return res.status(404).json({ message: `user not found` });
        }
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (validPassword === false) {
            return res.status(401).json({ message: `Invalid Password` });
        }
        const accesstoken = yield (0, jwt_helper_1.signAccessToken)(user._id.toString());
        //res.status(200).json({ message: `logged in`, accesstoken });
        res.render("timeline.ejs", { userId: user._id, accesstoken: accesstoken });
    }
    catch (error) {
        if (error.isJoi === true)
            return res.status(400).json({ message: error });
        res.status(500).json({ message: error });
    }
}));
