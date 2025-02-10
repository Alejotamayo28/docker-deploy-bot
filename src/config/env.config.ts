import dotenv from "dotenv";

dotenv.config();

export const config = {
  BOT_TOKEN: process.env.BOT_TOKEN!,
  ADMIN_ID: Number(process.env.ADMIN_ID!),
  DOCKER_USERNAME: process.env.DOCKER_USERNAME!,
  DOCKER_PASSWORD: process.env.DOCKER_PASSWORD!,
  DOCKER_REPO: process.env.DOCKER_REPO!,
  DOCKER_TOKEN: process.env.DOCKER_TOKEN!,
};
