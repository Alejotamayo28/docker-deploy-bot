import { Telegraf } from "telegraf";
import { EnvProcess } from "../../config/env.process";
import { terminateEC2Instance } from "../../services/ec2/aws.service";

export async function EC2InstanceHandlers(Env: EnvProcess, bot: Telegraf) {
  bot.action(/^instance_stop:(.+)$/, async (ctx) => {
    try {
      const instanceId = ctx.match[1]
      await terminateEC2Instance(Env, instanceId)
      return await ctx.reply(`✅ La instancia EC2 con el id: ${instanceId}, ha sido terminada.`);
    } catch (error) {
      console.error('Error: ', error)
    }
  })
}
