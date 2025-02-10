import { InlineKeyboardButton, InlineKeyboardMarkup } from "telegraf/types";
import { DockerImageTag } from "../../docker/interfaces/docker-types";

export function createDockerImagesKeyboard(
  images: DockerImageTag[],
): InlineKeyboardMarkup {
  const keyboard: InlineKeyboardButton[][] = images.map((image) => [
    {
      text: image.name,
      callback_data: `select_image:${image.id}`, // Formato: acción:id
    },
  ]);
  return {
    inline_keyboard: keyboard,
  };
}
