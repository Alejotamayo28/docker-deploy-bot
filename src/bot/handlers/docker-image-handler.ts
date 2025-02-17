import { bot } from "../..";
import { DOCKER_MESSAGES } from "../../constants/messages";
import { DockerEngineClient } from "../../docker/clients/docker-engine-client";
import { DockerImageTag } from "../../docker/interfaces/docker-types";

export async function setUpDockerImageHandler(images: DockerImageTag[]) {
  bot.action(/^select_image:(\d+)$/, async (ctx) => {
    try {
      const imageId = ctx.match[1];
      await ctx.answerCbQuery(`Imagen seleccionada: ${imageId}`);
      await ctx.reply(DOCKER_MESSAGES.IMAGE_ACTION_PROMPT(imageId), {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🚀 Ejecutar", callback_data: `run_image:${imageId}` },
              { text: "ℹ️ Info", callback_data: `info_image:${imageId}` },
            ],
          ],
        },
      });
    } catch (error) {
      console.error("Error: ", error);
    }
  });
  const dockerEngine = new DockerEngineClient();

  bot.action(/^run_image:(\d+)$/, async (ctx) => {
    try {
      const imageId = ctx.match[1];
      await ctx.answerCbQuery();
      const message01 = await ctx.reply(DOCKER_MESSAGES.IMAGE_EXECUTING(imageId));
      const imageInfo = images.find((image: DockerImageTag) => {
        return image.id == Number(imageId);
      });
      await dockerEngine.runContainer(imageInfo!);
      await ctx.deleteMessage(message01.message_id);
      await ctx.reply(DOCKER_MESSAGES.IMAGE_ON_EXECUTION(imageInfo!.name))
      return await ctx.reply(
        DOCKER_MESSAGES.IMAGE_ACTION_PROMPT(imageId),
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "🚀 Dentener", callback_data: `stop_image:${imageId}` }],
            ],
          },
        },
      );
    } catch (error) {
      console.error(`Error: `, error);
    }
  });

  bot.action(/^stop_image:(\d+)$/, async (ctx) => {
    const imageId = ctx.match[1];
    const imageInfo = images.find((image: DockerImageTag) => {
      return image.id == Number(imageId);
    });
    await dockerEngine.stopContainer(imageInfo!);
    await ctx.reply(`✅ El contenedor ha sido detenido.`);
  });

  bot.action(/^info_image:(\d+)$/, async (ctx) => {
    try {
      const imageId = ctx.match[1];
      await ctx.answerCbQuery();
      await ctx.reply(`Informacion imagen: ${imageId}...`);
      const imageInfo = images.find((image: DockerImageTag) => {
        return image.id == Number(imageId);
      });
      console.log("Images: ", imageInfo);
      return await ctx.reply(DOCKER_MESSAGES.IMAGE_INFO(imageInfo!), {
        parse_mode: "Markdown",
      });
    } catch (error) {
      console.error("Error: ", error);
    }
  });
}
