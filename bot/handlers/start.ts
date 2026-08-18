import type { Context } from "grammy";
import { ERROR_MESSAGES, ErrorCode } from "../../network/error.ts";
import User from "../../db/schema/user.ts";

export async function handleStart(ctx: Context): Promise<void> {
  try {
    const user = await User.findOne({ tgId: ctx.from?.id.toString() });

    if (!user) {
      const newUser = await User.insertOne({
        tgId: ctx.from?.id.toString(),
        state: "idle",
      });

      if (!newUser) {
        await ctx.reply(
          `مرحباً، ${ctx.from?.first_name}.\nفشل تسجيلك كمستخدم، يرجى إعادة المحاولة لاحقاً.`,
        );
        return;
      }
    }

    await ctx.reply(
      `<b>مرحباً، ${ctx.from?.first_name}!</b>\n\nيسمح لك bookie بتحميل مجموعة كبيرة من الكتب بصيغة PDF من عدة مصادر مفتوحة وبسرعة إستثنائية.\n\nلمعرفة كيفية إستخدامه، إستخدم الأمر:\n/help`,
      {
        parse_mode: "HTML",
      },
    );
    return;
  } catch (error) {
    await ctx.reply(
      ERROR_MESSAGES[ErrorCode.UNKNOWN] ??
        "عذراً.. حدث خطأ غير متوقع أثناء معالجة الطلب.",
    );
    console.log(error);
    return;
  }
}
