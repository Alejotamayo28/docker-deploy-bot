import { Telegraf } from "telegraf";
import { setupStartCommand } from "./bot/commands/start.commands";
import { EnvProcess } from "./config/env.process";
import { mainMenuHandlers } from "./bot/handlers/main-menu-handler";
import { EC2InstanceHandlers } from "./bot/handlers/ec2-instance.handler";
import { DockerImageHandlers } from "./bot/handlers/docker-image-handler";

let bot: any = null;
let isInitialized = false;

export default {
  async fetch(request: Request, env: EnvProcess): Promise<Response> {
    if (request.method === "GET") {
      return new Response(
        "Este es un webhook para un bot de Telegram.",
        { status: 200 }
      );
    }
    if (request.method !== "POST") {
      return new Response("Solo se aceptan solicitudes POST.", { status: 405 });
    }
    try {
      if (!isInitialized) {
        bot = new Telegraf(env.BOT_TOKEN, {
          handlerTimeout: 190000,
        });
        await setupStartCommand(env, bot)
        await Promise.all([
          mainMenuHandlers(env, bot),
          DockerImageHandlers(env, bot),
          EC2InstanceHandlers(env, bot)
        ])
        isInitialized = true;
        console.log("Bot inicializado correctamente con todos los handlers");
      }
      const update = await request.json();
      await bot.handleUpdate(update);
      return new Response('OK', { status: 200 });
    } catch (error) {
      console.error("Error:", error);
      return new Response("Error interno", { status: 500 });
    }
  },
};
