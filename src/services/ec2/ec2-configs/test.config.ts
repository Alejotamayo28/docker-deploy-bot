import { RunInstancesCommandInput } from "@aws-sdk/client-ec2";

export function testEc2Config(): RunInstancesCommandInput {
  return {
    ImageId: 'ami-04b4f1a9cf54c11d0',
    InstanceType: 't2.micro',
    MinCount: 1,
    MaxCount: 1,
    SubnetId: 'subnet-0dab0123269f15b16',
    SecurityGroupIds: ['sg-0f444c6a7432cb924'],
    KeyName: 'DockerBot-Key',
    TagSpecifications: [
      {
        ResourceType: "instance",
        Tags: [{ Key: "Env", Value: "test" }]
      },
    ],
  }
}

