import { EC2Client } from "@aws-sdk/client-ec2";
import { config } from '../config/env.config'

export const AWSclient = new EC2Client({
  region: config.AWS_REGION!,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID!,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY!
  }
})
