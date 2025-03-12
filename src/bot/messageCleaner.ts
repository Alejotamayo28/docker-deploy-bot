import { Context } from "telegraf";

export const messagesToDelete = new Set<number>()

export function addMessage(messageId: number) {
  messagesToDelete.add(messageId)
}

export async function deleteAllMessages(ctx: Context) {
  if (messagesToDelete.size > 0) {
    messagesToDelete.forEach(async (messageId) => {
      await ctx.deleteMessage(messageId).catch(console.error)
    })
    messagesToDelete.clear()
  }
}
