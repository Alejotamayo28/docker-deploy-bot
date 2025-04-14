import { Telegraf } from "telegraf";
import { DOCKER_MESSAGES } from "../../constants/messages";
import { DockerImageTag } from "../../docker/interfaces/docker-types";
import { launchEC2Instance, waitForInstanceEC2Ready } from "../../services/ec2/aws.service";
import { imagesLogo } from "../../services/s3/image-assets";
import { addMessage, deleteAllMessages } from "../messageCleaner";
import { EnvProcess } from "../../config/env.process";
import { fetchDockerImages } from "../../docker/clients/docker-hub-client";

export async function DockerImageHandlers(Env: EnvProcess, bot: Telegraf) {

  bot.action(/^run_image:(\d+)$/, async (ctx) => {
    await deleteAllMessages(ctx)
    await ctx.answerCbQuery().catch(console.error)
    try {
      const processingMsg = await ctx.reply("Iniciando instancia EC2 y scripts..")
      const images = await fetchDockerImages(Env)
      const imageId = ctx.match[1];
      const imageInfo = images.find((image: DockerImageTag) => {
        return image.id == Number(imageId)
      })
      const instanceId = await launchEC2Instance(Env, imageInfo!)
      await waitForInstanceEC2Ready(Env, instanceId)
      await ctx.telegram.editMessageText(
        ctx.chat?.id,
        processingMsg.message_id,
        undefined,
        `Intancia EC2 alzada con la imagen ${imageInfo!.name}\nID: ${imageInfo!.id}`)
    } catch (error) {
      console.error(`Error: `, error);
    }
  });

  bot.action(/^info_image:(\d+)$/, async (ctx) => {
    try {
      const images = await fetchDockerImages(Env)
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

















