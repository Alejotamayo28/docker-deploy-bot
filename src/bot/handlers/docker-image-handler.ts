import { Context, Telegraf } from "telegraf";
import { DOCKER_MESSAGES } from "../../constants/messages";
import { DockerImageTag } from "../../docker/interfaces/docker-types";
import { launchEC2Instance, terminateEC2Instance, waitForInstanceEC2Ready } from "../../services/ec2/aws.service";
import { imagesLogo } from "../../services/s3/image-assets";
import { addMessage, deleteAllMessages } from "../messageCleaner";
import { EnvProcess } from "../..";

export async function setUpDockerImageHandler
  (Env: EnvProcess, bot: Telegraf, images: DockerImageTag[]) {
  bot.action(/^select_image:(\d+)$/, async (ctx) => {
    await deleteAllMessages(ctx)
    try {
      const imageId = ctx.match[1];
      const { message_id } = await ctx.reply(
        DOCKER_MESSAGES.IMAGE_ACTION_PROMPT(imageId), {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🚀 Ejecutar", callback_data: `run_image:${imageId}` },
              { text: "ℹ️ Info", callback_data: `info_image:${imageId}` },
            ],
          ],
        },
      });
      addMessage(message_id)
    } catch (error) {
      console.error("Error: ", error);
    }
  });

  bot.action(/^run_image:(\d+)$/, async (ctx) => {
    await deleteAllMessages(ctx)
    try {
      await ctx.answerCbQuery('Ejecutando la instancia EC2 & Scripts')
      const imageId = ctx.match[1];
      const imageInfo = images.find((image: DockerImageTag) => {
        return image.id == Number(imageId)
      })
      const instanceId = await launchEC2Instance(Env, imageInfo!)
      await waitForInstanceEC2Ready(Env, instanceId)
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
    await terminateEC2Instance(Env)
    return await ctx.reply(`✅ La instancia EC2 ha sido terminada.`);
  });

  bot.action(/^info_image:(\d+)$/, async (ctx) => {
    try {
      const imageId = ctx.match[1];
      const imageInfo = images.find((image: DockerImageTag) => {
        return image.id == Number(imageId)
      })
      const completedMessage = await ctx.replyWithPhoto(
        imagesLogo[imageInfo!.name], {
        caption:
          `Informacion imagen: ${imageId}\n` +
          DOCKER_MESSAGES.IMAGE_INFO(imageInfo!),
        parse_mode: "Markdown"
      })
      addMessage(completedMessage.message_id)
    } catch (error) {
      console.error("Error: ", error);
    }
  });
}

interface ContextWithMatch extends Context {
  match: RegExpExecArray
}
















