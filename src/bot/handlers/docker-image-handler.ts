import { Context, Telegraf } from "telegraf";
import { DOCKER_MESSAGES } from "../../constants/messages";
import { DockerImageTag } from "../../docker/interfaces/docker-types";
import { launchEC2Instance, waitForInstanceEC2Ready } from "../../services/ec2/aws.service";
import { imagesLogo } from "../../services/s3/image-assets";
import { addMessage, deleteAllMessages } from "../messageCleaner";
import { EnvProcess } from "../../config/env.process";

export async function setUpDockerImageHandler
  (Env: EnvProcess, bot: Telegraf, images: DockerImageTag[]) {
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
      return await ctx.reply(`Instancia EC2 con la imagen: ${imageInfo?.name} alzada.`)
    } catch (error) {
      console.error(`Error: `, error);
    }
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

















