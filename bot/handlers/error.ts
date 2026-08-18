import { BotError, GrammyError, HttpError } from "grammy";

export async function handleError(err: BotError) {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else if (
    typeof e === "object" &&
    e !== null &&
    "code" in e &&
    e.code === "ERR_INVALID_URL"
  ) {
    await ctx.reply("الرجاء إدخال رابط صالح ومدعوم بعد الأمر.");
  } else {
    console.error("Unknown error:", e);
  }
}
