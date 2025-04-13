import { DescribeInstancesCommandOutput } from "@aws-sdk/client-ec2";
import { Context } from "telegraf";
import { createMainMenu } from "../../bot/keyboards/main-menu.keyboard";

export async function validateEC2InstancesAvailability(instances: DescribeInstancesCommandOutput, ctx: Context) {
  if (instances.Reservations?.length === 0 || !instances.Reservations) {
    const keyboard = createMainMenu()
    await ctx.reply('No se encontraron reservaciones de EC2 en tu cuenta', {
      reply_markup: keyboard.keyboard
    })
    throw new Error('NO_RESERVATIONS')
  }
  const allInstances = instances.Reservations?.flatMap(r => r.Instances ?? [])
  if (allInstances?.length === 0) {
    const keyboard = createMainMenu()
    await ctx.reply('No tienes ninguna instancia EC2 corriendo', {
      reply_markup: keyboard.keyboard
    })
    throw new Error('NO_RUNNING_INSTANCES')
  }
}
