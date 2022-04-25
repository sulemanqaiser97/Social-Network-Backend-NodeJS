"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.dwmov.mongodb.net/myFirstDatabase`;
const SERVER_PORT = process.env.SERVER_PORT
    ? Number(process.env.SERVER_PORT)
    : 1337;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET || "";
const REFRESH_TOKEN = process.env.REFRESH_TOKEN_SECRET || "";
exports.config = {
    mongo: {
        MONGO_URL,
    },
    server: {
        SERVER_PORT,
    },
    secrets: {
        ACCESS_TOKEN,
        REFRESH_TOKEN,
    },
};
