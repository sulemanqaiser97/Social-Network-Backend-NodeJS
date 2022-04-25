"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignature = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const signAccessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {};
        const secret = config_1.config.secrets.ACCESS_TOKEN;
        const options = {
            expiresIn: "1h",
            issuer: "socialnetwork.com",
            audience: userId,
        };
        jsonwebtoken_1.default.sign(payload, secret, options, (err, token) => {
            if (err)
                reject(err);
            resolve(token);
        });
    });
};
exports.signAccessToken = signAccessToken;
const verifySignature = (req, res, next) => {
    var _a;
    if (!((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.includes("Bearer ")))
        return res.status(401).json({ message: `Unauthorized` });
    const authHeaderToken = req.headers.authorization.split(" ")[1];
    jsonwebtoken_1.default.verify(authHeaderToken, config_1.config.secrets.ACCESS_TOKEN, (err, payload) => {
        if (err)
            return res.status(401).json({ message: `Unauthorized` });
        next();
    });
};
exports.verifySignature = verifySignature;
