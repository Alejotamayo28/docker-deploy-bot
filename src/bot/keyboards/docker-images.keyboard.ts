import { InlineKeyboardButton, InlineKeyboardMarkup } from "telegraf/types";
import { DockerImageTag } from "../../docker/interfaces/docker-types";

const imageMethod = {
  imageRunKeyboard: "run_image",
  imageInfoKeyboard: "info_image"
} as const

const imageMethodMessage = {
  imageRunKeyboard: "Escoge la imagen que te gustaria lanzar dentro de una instancia EC2:",
  imageInfoKeyboard: "Escoge la imagen para ver su informacion: "
} satisfies { [key in keyof typeof imageMethod]: string };

function buildKeyboardButton(images: DockerImageTag[],
  method: keyof typeof imageMethod): InlineKeyboardButton[][] {
  return images.map((image) => [
    {
      text: image.name,
      callback_data: `${imageMethod[method]}:${image.id}`,
    },
  ]);
}

export function BuildImagesKeyboard(images: DockerImageTag[], method: keyof typeof imageMethod) {
  const message = imageMethodMessage[method]
  const mapKeyboard = buildKeyboardButton(images, method)
  const keyboard: InlineKeyboardMarkup = {
    inline_keyboard: mapKeyboard
  }
  return {
    message: message,
    keyboard: keyboard
  }
}

