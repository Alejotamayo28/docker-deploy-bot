import { RunInstancesCommandInput } from "@aws-sdk/client-ec2";
import dotenv from "dotenv"

dotenv.config()

// Instancia basica / barata de AWS EC2
export function testEc2Config(): RunInstancesCommandInput {
  return {
    ImageId: process.env.AWS_EC2_IMAGE_ID,
    InstanceType: 't2.micro',
    MinCount: 1,
    MaxCount: 1,
    SubnetId: process.env.AWS_EC2_SUBNET_ID,
    SecurityGroupIds: [process.env.AWS_EC2_SECURITY_GROUP!],
    KeyName: process.env.AWS_EC2_KEY_NAME,
    TagSpecifications: [
      {
        ResourceType: "instance",
        Tags: [{ Key: "Env", Value: "test" }]
      },
    ],
  }
}

