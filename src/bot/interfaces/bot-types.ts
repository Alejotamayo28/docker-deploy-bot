import { InlineKeyboardMarkup } from "telegraf/types";

export interface InlineMenuResponse {
  message: string,
  keyboard: InlineKeyboardMarkup
}
