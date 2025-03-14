import { bot } from "../..";
import { imagesLogo } from "../../config/images";
import { DOCKER_MESSAGES } from "../../constants/messages";
import { DockerImageTag } from "../../docker/interfaces/docker-types";
import { launchEC2Instance, terminateEC2Instance, waitForInstanceReady } from "../../services/ec2/aws.service";
import { addMessage, deleteAllMessages } from "../messageCleaner";


export async function setUpDockerImageHandler(images: DockerImageTag[]) {
  bot.action(/^select_image:(\d+)$/, async (ctx) => {
    try {
      const imageId = ctx.match[1];
      //await ctx.answerCbQuery(`Imagen seleccionada: ${imageId}`);
      const inlineMessage = await ctx.reply(DOCKER_MESSAGES.IMAGE_ACTION_PROMPT(imageId), {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🚀 Ejecutar", callback_data: `run_image:${imageId}` },
              { text: "ℹ️ Info", callback_data: `info_image:${imageId}` },
            ],
          ],
        },
      });
      addMessage(inlineMessage.message_id)
    } catch (error) {
      console.error("Error: ", error);
    }
  });



  bot.action(/^run_image:(\d+)$/, async (ctx) => {
    await deleteAllMessages(ctx)
    try {
      const imageId = ctx.match[1];
      const imageInfo = images.find((image: DockerImageTag) => {
        return image.id == Number(imageId);
      });
      const instanceId = await launchEC2Instance(imageInfo!)
      await ctx.reply(`🚀 Instancia EC2 ejecutada exitosamente con el id: ${instanceId}`)
      await waitForInstanceReady(instanceId, ctx)
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
    await terminateEC2Instance()
    await ctx.reply(`✅ El contenedor ha sido detenido.`);
  });

  bot.action(/^info_image:(\d+)$/, async (ctx) => {
    try {
      const imageId = ctx.match[1];
      await ctx.answerCbQuery();
      const imageInfo = images.find((image: DockerImageTag) => {
        return image.id == Number(imageId);
      });
      const infoMessage = await ctx.reply(`Informacion imagen: ${imageId}\n`
        + DOCKER_MESSAGES.IMAGE_INFO(imageInfo!), {
        parse_mode: "Markdown",
      });
      const photoMessage = await ctx.replyWithPhoto({
        url: imagesLogo[imageInfo!.name],
      }, { caption: "E-commerce" })
      addMessage(infoMessage.message_id)
      addMessage(photoMessage.message_id)
    } catch (error) {
      console.error("Error: ", error);
    }
  });
}
