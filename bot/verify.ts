import { Context, type NextFunction, InlineKeyboard } from "grammy";

async function verifySubscription(ctx: Context, next: NextFunction) {
  const subscribed = (
    await ctx.api.getChatMember("-1003771695460", ctx.from?.id!)
  ).status;

  if (subscribed !== "member") {
    const ilKeyboard = new InlineKeyboard().url(
      "الإشتراك",
      "https://t.me/vorkampfer",
    );

    ctx.reply("الرجاء الإشتراك في قناة المطور أولاً ثم إستخدام الأمر /start.", {
      reply_markup: ilKeyboard,
    });
    return;
  }

  await next();
  return;
}

export default verifySubscription;
