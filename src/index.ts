import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { setupStartCommand } from "./bot/commands/start.commands";

dotenv.config();

export const bot = new Telegraf(process.env.BOT_TOKEN!);

setupStartCommand();

bot.launch().then(() => "Hola");
