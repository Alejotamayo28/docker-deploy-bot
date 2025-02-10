"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    BOT_TOKEN: process.env.BOT_TOKEN,
    ADMIN_ID: Number(process.env.ADMIN_ID),
    DOCKER_USERNAME: process.env.DOCKER_USERNAME,
    DOCKER_PASSWORD: process.env.DOCKER_PASSWORD,
    DOCKER_REPO: process.env.DOCKER_REPO,
    DOCKER_TOKEN: process.env.DOCKER_TOKEN,
};
