"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchemaValidation = exports.authSchemaValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const authSchemaValidation = joi_1.default.object({
    username: joi_1.default.string().required(),
    email: joi_1.default.string().email().lowercase().required(),
    password: joi_1.default.string().min(6).required(),
});
exports.authSchemaValidation = authSchemaValidation;
const loginSchemaValidation = joi_1.default.object({
    username: joi_1.default.string().required(),
    password: joi_1.default.string().min(6).required(),
});
exports.loginSchemaValidation = loginSchemaValidation;
