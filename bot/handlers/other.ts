import type { Context } from "grammy";

export async function handleOther(ctx: Context): Promise<void> {
  ctx.reply(
    "الرجاء إرسال إسم الكتاب أو رابطه عن طريق الأوامر المناسبة.\n\nللمزيد من المساعدة، إستخدم الأمر:\n/help",
  );
  return;
}
