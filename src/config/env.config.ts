import dotenv from "dotenv";

dotenv.config();

export const config = {
  BOT_TOKEN: process.env.BOT_TOKEN!,
  ADMIN_ID: Number(process.env.ADMIN_ID!),
  DOCKER_USERNAME: process.env.DOCKER_USERNAME!,
  DOCKER_PASSWORD: process.env.DOCKER_PASSWORD!,
  DOCKER_REPO: process.env.DOCKER_REPO!,
  DOCKER_TOKEN: process.env.DOCKER_TOKEN!,
  AWS_REGION: process.env.AWS_REGION!,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!
};






