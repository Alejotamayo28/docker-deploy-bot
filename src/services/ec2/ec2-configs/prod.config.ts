import { RunInstancesCommandInput } from "@aws-sdk/client-ec2";
import { DockerImageTag } from "../../../docker/interfaces/docker-types";

interface ProdConfigParams {
  dockerImageTag: DockerImageTag,
  dockerBash: string
}

export function prodEc2Config(params: ProdConfigParams): RunInstancesCommandInput {
  return {
    ImageId: 'ami-04b4f1a9cf54c11d0',
    InstanceType: 't2.micro',
    MinCount: 1,
    MaxCount: 1,
    UserData: params.dockerBash,
    SubnetId: 'subnet-0dab0123269f15b16',
    SecurityGroupIds: ['sg-0f444c6a7432cb924'],
    KeyName: 'DockerBot-Key',
    TagSpecifications: [
      {
        ResourceType: 'instance',
        Tags: [
          {
            Key: 'Name',
            Value: `DockerBot-${params.dockerImageTag.name}`
          },
          {
            Key: 'DockerImage',
            Value: params.dockerImageTag.name
          }
        ]
      }
    ]
  }
}
