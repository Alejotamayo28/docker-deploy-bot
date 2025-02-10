"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
const telegraf_1 = require("telegraf");
const dotenv_1 = __importDefault(require("dotenv"));
const start_commands_1 = require("./bot/commands/start.commands");
dotenv_1.default.config();
exports.bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
(0, start_commands_1.setupStartCommand)();
exports.bot.launch().then(() => "Hola");
