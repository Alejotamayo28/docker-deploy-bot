import { Context, Telegraf } from "telegraf";
import { checkValidateId } from "../../auth/admin.auth"; import { EnvProcess } from "../..";
import { fetchDockerImages } from "../../docker/clients/docker-hub-client";
import { createDockerImagesKeyboard } from "../keyboards/docker-images.keyboard";
import { addMessage } from "../messageCleaner";

export async function setupStartCommand(bot: Telegraf, Env: EnvProcess): Promise<void> {
  bot.command('start', async (ctx: Context) => {
    try {
      if (!checkValidateId(ctx.from!.id, Env.ADMIN_ID)) {
        await ctx.reply("No tienes permiso para usar este bot. Contacta al administrador.");
      }
      await setupStartCommand(bot, Env)
      const imagesTag = await fetchDockerImages(Env)
      const keyboard = createDockerImagesKeyboard(imagesTag)
      const imagesMessage = await ctx.reply("Selecciona una de las siguientes imágenes: ", {
        reply_markup: keyboard,
      });
      addMessage(imagesMessage.message_id)
    } catch (error) {
      console.error("Error en el comando start:", error);
      await ctx.reply("Ha ocurrido un error al iniciar el bot. Por favor, inténtalo más tarde.");
    }
  });
}
