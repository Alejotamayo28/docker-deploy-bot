import { Telegraf } from "telegraf";
import { setUpDockerImageHandler } from "./bot/handlers/docker-image-handler";
import { fetchDockerImages } from "./docker/clients/docker-hub-client";
import { setupStartCommand } from "./bot/commands/start.commands";

export interface EnvProcess {
  ADMIN_ID: number;
  BOT_TOKEN: string;
  DOCKER_USERNAME: string,
  DOCKER_PASSWORD: string,
  DOCKER_REPO: string
  DOCKER_TOKEN: string
  AWS_REGION: string,
  AWS_ACCESS_KEY_ID: string,
  AWS_SECRET_ACCESS_KEY: string
}

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
      const bot = new Telegraf(env.BOT_TOKEN, {
        handlerTimeout: 190000,
      });

      await setupStartCommand(bot, env)
      const imagesTag = await fetchDockerImages(env)
      await setUpDockerImageHandler(env, bot, imagesTag)

      const update = await request.json();
      await bot.handleUpdate(update);
      return new Response('OK', { status: 200 });
    } catch (error) {
      console.error("Error:", error);
      return new Response("Error interno", { status: 500 });
    }
  },
};
