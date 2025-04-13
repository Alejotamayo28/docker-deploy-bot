import { InlineKeyboardMarkup } from "telegraf/types"
import { InlineMenuResponse } from "../interfaces/bot-types"

export function createMainMenu(): InlineMenuResponse {
  const message = 'Selecciona la opcion con la que te gustaria continuar: '
  const keybaord: InlineKeyboardMarkup = {
    inline_keyboard: [
      [
        {
          text: "Lanzar nueva instancia",
          callback_data: 'launch_instance'
        }
      ],
      [
        {
          text: "Gestionar instancias activas",
          callback_data: 'management_instance'
        }
      ],
      [
        {
          text: "Ver instancias activas",
          callback_data: "active_instance"
        }
      ],
      [
        {
          text: "Detener instancias activas",
          callback_data: "stop_instance"
        }
      ]
    ]
  }
  return {
    message: message,
    keyboard: keybaord
  }
}
