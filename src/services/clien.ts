import { EC2Client } from "@aws-sdk/client-ec2";
import { EnvProcess } from "..";

export function createEc2Client(env: EnvProcess) {
  return new EC2Client({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY
    }
  });
}
