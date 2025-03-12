import { Context } from "telegraf";
import { checkValidateId } from "../../auth/admin.auth";
import { fetchDockerImages } from "../../docker/clients/docker-hub-client";
import { bot } from "../..";
import { createDockerImagesKeyboard } from "../keyboards/docker-images.keyboard";
import { setUpDockerImageHandler } from "../handlers/docker-image-handler";
import { addMessage } from "../messageCleaner";

export function setupStartCommand() {
  bot.command("start", async (ctx: Context) => {
    if (checkValidateId(ctx.from!.id)) {
      const images = await fetchDockerImages();
      const keyboard = createDockerImagesKeyboard(images);
      const imagesMessage = await ctx.reply("Selecciona una de las siguientes imagenes: ", {
        reply_markup: keyboard,
      });
      addMessage(imagesMessage.message_id)
      return setUpDockerImageHandler(images)
    }
  });
}
