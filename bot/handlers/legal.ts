import type { Context } from "grammy";

export async function handleLegal(ctx: Context): Promise<void> {
  ctx.reply(
    "<b>الصفة القانونية</b>\n\n- يوافق bookie على سياسة المستخدم التي تنص عليها مكتبة نور، وذلك بعدم إستخدامه لأغراض ربحية.\n- لا يتبنى أو يدعم bookie أياً من المؤلفات أو منشئيها؛ الغرض الأساسي هو توفير مصادر مجانية تحت حماية <a href='https://www.un.org/ar/about-us/universal-declaration-of-human-rights'>المادة 27 من الإعلان العالمي لحقوق الإنسان</a>، والذي ينص على أن لكل شخص حق المشاركة الحرة في حياة المجتمع الثقافية.\n- تنص <a href='https://eff.org'>مؤسسة التخوم الإلكترونية</a> أن توفير أداة للعامة لنسخ المواد الإلكترونية لا يوفر تبعية قانونية لإصدار إنتهاك لقوانين النشر والطبع.",
    {
      parse_mode: "HTML",
      link_preview_options: {
        is_disabled: true,
      },
    },
  );
  return;
}
