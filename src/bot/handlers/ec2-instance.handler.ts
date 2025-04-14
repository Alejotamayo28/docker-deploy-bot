import { Telegraf } from "telegraf";
import { EnvProcess } from "../../config/env.process";
import { terminateEC2Instance } from "../../services/ec2/aws.service";

export async function EC2InstanceHandlers(Env: EnvProcess, bot: Telegraf) {
  bot.action(/^instance_stop:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery().catch(console.error)
    try {
      const instanceId = ctx.match[1]
      await terminateEC2Instance(Env, instanceId)
      await ctx.reply(`✅ La instancia EC2 con el id: ${instanceId}, ha sido terminada.`);
    } catch (error) {
      console.error('Error: ', error)
    }
  })
}
