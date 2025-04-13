import {
  DescribeInstancesCommand,
  DescribeInstancesCommandOutput,
  DescribeInstanceStatusCommand, EC2Client, RunInstancesCommand,
  TerminateInstancesCommand, TerminateInstancesCommandInput
} from '@aws-sdk/client-ec2'
import { DockerImageTag } from '../../docker/interfaces/docker-types'
import { generateDockerSetupScript } from './docker-setup'
import { createEc2Client } from '../clien'
import { EnvProcess } from '../../config/env.process';
import { Ec2Config } from './ec2-configs';

let instanceId: string | undefined;

export async function launchEC2Instance
  (Env: EnvProcess, dockerImage: DockerImageTag): Promise<string> {
  try {
    const dockerSetupScript = generateDockerSetupScript({
      userName: Env.DOCKER_USERNAME!,
      password: Env.DOCKER_PASSWORD!,
      image: dockerImage
    })
    const params = Ec2Config.Production({
      dockerImageTag: dockerImage, dockerBash: dockerSetupScript
    })
    const command = new RunInstancesCommand(params)
    const Ec2Client = createEc2Client(Env)
    const result = await Ec2Client.send(command)
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

export async function terminateEC2Instance
  (Env: EnvProcess, instanceId: string): Promise<boolean> {
  try {
    const params: TerminateInstancesCommandInput = {
      InstanceIds: [instanceId]
    }
    const command = new TerminateInstancesCommand(params)
    const Ec2Client = createEc2Client(Env)
    await Ec2Client.send(command)
    return true
  } catch (error) {
    console.error('Error al terminar la instancia EC2: ', error)
    throw error
  }
}

export async function waitForInstanceEC2Ready
  (Env: EnvProcess, instanceId: string): Promise<void> {
  try {
    while (true) {
      const command = new DescribeInstanceStatusCommand({
        InstanceIds: [instanceId]
      })
      const Ec2Client = createEc2Client(Env)
      const response = await Ec2Client.send(command)
      const instanceStaus = response.InstanceStatuses?.[0]
      if (instanceStaus?.InstanceStatus?.Status === 'initializing' &&
        instanceStaus.SystemStatus?.Status === 'initializing') {
        break
      }
      await new Promise((resolve) => setTimeout(resolve, 20000))
    }
  } catch (error) {
    console.error('Error al esperar el ready de la Instancia EC2: ', error)
    throw error
  }
}

export async function getRunningEC2Instances(ec2Client: EC2Client):
  Promise<DescribeInstancesCommandOutput> {
  return await ec2Client.send(new DescribeInstancesCommand({
    Filters: [{
      Name: "instance-state-name",
      Values: ["running"]
    }]
  }))
}
