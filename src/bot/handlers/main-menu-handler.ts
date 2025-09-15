import { Telegraf } from "telegraf";
import { fetchDockerImages } from "../../docker/clients/docker-hub-client";
import { EnvProcess } from "../../config/env.process";
import { createEc2Client } from "../../services/clien";
import { getEC2Metrics } from "../../services/cloud-watch/cloudwatch-service";
import { getRunningEC2Instances } from "../../services/ec2/aws.service";
import { validateEC2InstancesAvailability } from "../../services/ec2/ec2-validators";
import { BuildImagesKeyboard } from "../keyboards/docker-images.keyboard";
import { buildInstancesKeyboard } from "../keyboards/ec2-instances.keyboard";
import { CloudWatchFormatter } from "../../services/cloud-watch/cloudwatch-formatter";

export async function mainMenuHandlers(env: EnvProcess, bot: Telegraf,) {

  bot.action('launch_instance', async (ctx) => {
    try {
      const imagesTag = await fetchDockerImages(env)
      const keyboard = BuildImagesKeyboard(imagesTag, "imageRunKeyboard")
      await ctx.reply(keyboard.message, {
        reply_markup: keyboard.keyboard,
      });
    } catch (error) {
      console.error('Erorr: ', error)
    }
  })

  bot.action('management_instance', async (ctx) => {
    try {
      const Ec2Client = createEc2Client(env)
      const instances = await getRunningEC2Instances(Ec2Client)
      await validateEC2InstancesAvailability(instances, ctx)
      const ec2Metrics = await getEC2Metrics(env)
      const ec2MetricsText = CloudWatchFormatter.metricsToText(ec2Metrics)
      await ctx.reply(ec2MetricsText, { parse_mode: "Markdown" })
    } catch (error) {
      console.error('Error: ', error)
    }
  })

  bot.action('stop_instance', async (ctx) => {
    try {
      const Ec2Client = createEc2Client(env)
      const instances = await getRunningEC2Instances(Ec2Client)
      await validateEC2InstancesAvailability(instances, ctx)
      const keyboard = buildInstancesKeyboard(instances, "instanceStopKeyboard")
      await ctx.reply(keyboard.message, {
        reply_markup: keyboard.keyboard
      })
    } catch (error) {
      console.error('Error: ', error)
    }
  })

  bot.action('active_instance', async (ctx) => {
    try {
      const Ec2Client = createEc2Client(env)
      const instances = await getRunningEC2Instances(Ec2Client)
      await validateEC2InstancesAvailability(instances, ctx)
      const keyboard = buildInstancesKeyboard(instances, "instanceActiveKeyboard")
      await ctx.reply(keyboard.message, {
        reply_markup: keyboard.keyboard
      })
    } catch (error) {
      console.error('Error: ', error)
    }
  })
}
