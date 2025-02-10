import { Context } from "telegraf";
import { checkValidateId } from "../../auth/admin.auth";
import { fetchDockerImages } from "../../docker/clients/docker-hub-client";
import { bot } from "../..";
import { createDockerImagesKeyboard } from "../keyboards/docker-images.keyboard";
import { setUpDockerImageHandler } from "../handlers/docker-image-handler";

export function setupStartCommand() {
  bot.command("start", async (ctx: Context) => {
    if (checkValidateId(ctx.from!.id)) {
      const images = await fetchDockerImages();
      const keyboard = createDockerImagesKeyboard(images);
      await ctx.reply("Selecciona una de las siguientes imagenes: ", {
        reply_markup: keyboard,
      });
      return setUpDockerImageHandler(images)
    }
  });
}
