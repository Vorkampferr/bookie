import type { Context } from "grammy";
import { validateURL } from "../../utils/validator.ts";
import { escapeMarkdownV2 } from "../../utils/escaper.ts";
import crawlNoor from "../../network/noor_crawler/index.ts";
import { ErrorCode, ERROR_MESSAGES } from "../../network/error.ts";
import { InputFile } from "grammy";
import User from "../../db/schema/user.ts";
import type { queryResult } from "../../types/bot.ts";

export const dlCommandRegex = [
  /^\/dl_([a-zA-Z0-9]{10})$/,
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,63}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
  /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,63}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
];

export async function hanldeDownload(ctx: Context) {
  const session = (ctx as any).session as
    | { results?: queryResult[]; state: string }
    | undefined;

  session!.state = "downloading";

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

    return;
  }

  if (user!.state == "downloading") {
    await ctx.reply("يرجى الإنتظار لحين إنتهاء طلبك السابق.");
    return;
  }

  const urlString = ctx.message!.text!.split(" ")[0];

  let url;

  if (!urlString || urlString.trim().length < 10) {
    await ctx.reply("الرجاء إدخال رابط صالح.");
    return;
  }

  let checkURL = validateURL(urlString);
  if (!checkURL || checkURL.type == null) {
    await ctx.reply("الرجاء إدخال رابط صالح.");
    return;
  }

  if (checkURL.type == null || !checkURL) {
    await ctx.reply("الرجاء إدخال رابط أو أمر صالح.");
    return;
  }

  if (checkURL.type == "url") {
    url = checkURL.url;
  }

  if (checkURL.type == "command") {
    const results = session?.results ?? [];
    const commandUrl = results.find(
      (url) => url.id == checkURL.url!.split("/dl_")[1],
    );

    if (!commandUrl) {
      ctx.reply("إنتهت صلاحية الرابط؛ يرجى البحث عن الكتاب مجدداً.");
      return;
    }

    url = "https://noor-book.com" + commandUrl?.url;
  }

  user!.state = "downloading";
  const saveState = await user?.save();

  if (!saveState) {
    await ctx.reply("عذراً، فشل تحديث حالتك. يرجى المحاولة لاحقاً.");
    return;
  }

  const reply = await ctx.reply("جاري التنزيل...");

  try {
    const downloadResult = await crawlNoor(url!);
    const book = downloadResult[0];

    if (!book || book.data.data == null) {
      const errorText =
        book?.error?.text ??
        ERROR_MESSAGES[ErrorCode.UNKNOWN] ??
        "عذراً.. حدث خطأ غير متوقع أثناء معالجة الطلب.";
      await ctx.api.editMessageText(ctx.chatId!, reply.message_id, errorText);
      return;
    }

    await ctx.api.sendChatAction(ctx.chatId!, "upload_document");

    const escapedTitle = escapeMarkdownV2(book.data.title);
    const escapedAuthor =
      escapeMarkdownV2(book.data.author).trim() == "كاتب غير محدد"
        ? ""
        : `\\| ${escapeMarkdownV2(book.data.author)}`;

    const sendFile = await ctx.replyWithDocument(
      new InputFile(book.data.data, `${book.data.title}_bookie6bot.pdf`),
      {
        caption: `*${escapedTitle} ${escapedAuthor}*\n\nتم التحميل عبر بوت @bookie6bot`,
        parse_mode: "MarkdownV2",
      },
    );

    if (!sendFile) {
      await ctx.api.editMessageText(
        ctx.chatId!,
        reply.message_id,
        "عذراً.. حدث خطأ غير متوقع أثناء رفع الكتاب. حاول مرة أخرى.",
      );
      return;
    }

    await ctx.api.deleteMessage(ctx.chatId!, reply.message_id);
  } catch (err) {
    console.error(
      `Unhandled error in /download handler for chat ${ctx.chatId}, url ${url}:`,
      err,
    );
    await ctx.api
      .editMessageText(
        ctx.chatId!,
        reply.message_id,
        ERROR_MESSAGES[ErrorCode.UNKNOWN] ??
          "عذراً.. حدث خطأ غير متوقع أثناء معالجة الطلب.",
      )
      .catch((error) => {
        console.log(error);
      });
  } finally {
    session!.state = "idle";

    user!.state = "idle";
    const saveState = await user?.save();
    if (!saveState) {
      await ctx.reply("عذراً، فشل تحديث حالتك. يرجى المحاولة لاحقاً.");
      return;
    }
  }
}
