import { Context, Telegraf } from "telegraf";
import { checkValidateId } from "../../auth/admin.auth";
import { EnvProcess } from "../../config/env.process";
import { createMainMenu } from "../keyboards/main-menu.keyboard";

export async function setupStartCommand(bot: Telegraf, Env: EnvProcess): Promise<void> {
  bot.command('start', async (ctx: Context) => {
    try {
      if (!checkValidateId(ctx.from!.id, Env.ADMIN_ID)) {
        await ctx.reply("No tienes permiso para usar este bot. Contacta al administrador.");
      }
      const keyboard = createMainMenu()
      await ctx.reply(keyboard.message, {
        reply_markup: keyboard.keyboard
      })
    } catch (error) {
      console.error("Error en el comando start:", error);
      await ctx.reply("Ha ocurrido un error al iniciar el bot. Por favor, inténtalo más tarde.");
    }
  });
}
