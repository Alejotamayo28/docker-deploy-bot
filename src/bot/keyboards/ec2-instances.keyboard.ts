import { InlineKeyboardMarkup } from "telegraf/types";
import { EC2Instance, EC2InstanceState } from "../../services/ec2/interfaces/instance-ec2-types";
import { DescribeInstancesCommandOutput } from "@aws-sdk/client-ec2";

const instanceMethod = {
  instanceStopKeyboard: "instance_stop",
  instanceActiveKeyboard: "instance_active"
} as const

const instanceMethodMessage = {
  instanceStopKeyboard: 'Selecciona la instancia EC2 que deseas detener/terminar:',
  instanceActiveKeyboard: 'Listado de instancias activas:'
} satisfies { [key in keyof typeof instanceMethod]: string }


export function buildInstancesKeyboardButton(instances: EC2Instance[],
  method: keyof typeof instanceMethod) {
  return instances.map((instance: EC2Instance) => [
    {
      text: `${instance.name.split("-")[1]} | Encendida | ${instance.publicIpAddress}`,
      callback_data: `${instanceMethod[method]}:${instance.instanceId}`,
    },
  ])
}

export function buildInstancesKeyboard(describeInstances: DescribeInstancesCommandOutput,
  method: keyof typeof instanceMethod) {
  const instances: EC2Instance[] = describeInstances.Reservations!.flatMap(
    (reservation) => reservation.Instances!.map
      ((instance): EC2Instance => ({
        instanceId: instance.InstanceId!,
        name: instance.Tags?.find(tag => tag.Key === "Name")?.Value ?? "Unnamed",
        type: instance.InstanceType!,
        state: instance.State!.Name as EC2InstanceState,
        publicIpAddress: instance.PublicIpAddress!
      }))
  )
  const message = instanceMethodMessage[method]
  const mapKeyboard = buildInstancesKeyboardButton(instances, method)
  const keyboard: InlineKeyboardMarkup = {
    inline_keyboard: mapKeyboard
  }
  return {
    message: message,
    keyboard: keyboard
  }
}
