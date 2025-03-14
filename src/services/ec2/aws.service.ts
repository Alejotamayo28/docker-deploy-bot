import {
  DescribeInstanceStatusCommand, RunInstancesCommand, RunInstancesCommandInput,
  TerminateInstancesCommand, TerminateInstancesCommandInput
} from '@aws-sdk/client-ec2'
import { Context } from 'telegraf'
import { config } from '../../config/env.config'
import { DockerImageTag } from '../../docker/interfaces/docker-types'
import { generateDockerSetupScript } from './docker-setup'
import { AWSclient } from '../clien'

let instanceId: string | undefined;

export async function launchEC2Instance
  (dockerImage: DockerImageTag): Promise<string> {
  try {
    const dockerSetupScript = generateDockerSetupScript({
      userName: config.DOCKER_USERNAME,
      password: config.DOCKER_PASSWORD,
      image: dockerImage
    })
    const params: RunInstancesCommandInput = {
      ImageId: 'ami-04b4f1a9cf54c11d0',
      InstanceType: 't2.micro',
      MinCount: 1,
      MaxCount: 1,
      UserData: dockerSetupScript,
      SubnetId: 'subnet-0dab0123269f15b16',
      SecurityGroupIds: ['sg-0f444c6a7432cb924'],
      KeyName: 'DockerBot-Key',
      TagSpecifications: [
        {
          ResourceType: 'instance',
          Tags: [
            {
              Key: 'Name',
              Value: `DockerBot-${dockerImage.name}`
            },
            {
              Key: 'DockerImage',
              Value: dockerImage.name
            }
          ]
        }
      ]
    }
    const command = new RunInstancesCommand(params)
    const result = await AWSclient.send(command)
    instanceId = result.Instances?.[0].InstanceId
    if (!instanceId) {
      throw new Error('No se pudo obtener el ID de la instancia')
    }
    console.log(`Instance EC2 launched with ID: ${instanceId}`)
    return instanceId
  } catch (error) {
    console.error('Error al lanzar la instancia EC2: ', error)
    throw error
  }
}

export async function terminateEC2Instance(): Promise<boolean> {
  try {
    const params: TerminateInstancesCommandInput = {
      InstanceIds: [instanceId!]
    }
    const command = new TerminateInstancesCommand(params)
    await AWSclient.send(command)
    console.log(`Instancia EC2 ${instanceId} termianda correctamente`)
    return true
  } catch (error) {
    console.error('Error al terminar la instancia EC2: ', error)
    throw error
  }
}

export async function waitForInstanceEC2Ready(instanceId: string, ctx: Context): Promise<void> {
  try {
    const message = await ctx.reply('🚀 Levantando contenedor... 🐳')
    while (true) {
      const command = new DescribeInstanceStatusCommand({
        InstanceIds: [instanceId]
      })
      const response = await AWSclient.send(command)
      const instanceStaus = response.InstanceStatuses?.[0]
      if (instanceStaus?.InstanceStatus?.Status === 'ok') {
        console.log('Instance Status Check completed')
        break
      } console.log(`Waiting 20 seconds for the InstaceStatusHealthCheck = 'ok'...`)
      await new Promise((resolve) => setTimeout(resolve, 20000))
    }
    await ctx.telegram.editMessageText(ctx.chat!.id, message.message_id, undefined, '✅ Contenedor listo y ejecutándose 🐳');
  } catch (error) {
    console.error('Error al esperar el ready de la Instancia EC2: ', error)
    throw error
  }
}

