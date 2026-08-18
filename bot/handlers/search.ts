import type { Context } from "grammy";
import { searchQuery } from "../../network/noor_crawler/search";
import { ErrorCode, ERROR_MESSAGES } from "../../network/error";
import { escapeHtml } from "../../utils/escaper";
import type { SearchContext } from "../../types/contexts";
import type { scraperResponse } from "../../types/scraper";

export async function handleSearch(ctx: Context) {
  const searchCtx = ctx as SearchContext;

  const queryString: string = Array.isArray(ctx.match)
    ? (ctx.match[0] ?? "")
    : typeof ctx.match === "string"
      ? ctx.match
      : "";

  if (!queryString || queryString.trim().length === 0) {
    await ctx.reply(
      "الرجاء إدخال إسم الكتاب بعد الأمر، مثال:\n/search <إسم الكتاب>",
    );
    return;
  }

  const reply = await ctx.reply("جاري البحث...");

  try {
    const searchResults: scraperResponse = await searchQuery({
      text: queryString,
    });

    if (!searchResults || !searchResults.data?.data) {
      const errorText =
        ERROR_MESSAGES[ErrorCode.REQUEST_FAILED] ??
        "عذراً.. حدث خطأ غير متوقع أثناء معالجة الطلب.";
      await ctx.api.editMessageText(ctx.chatId!, reply.message_id, errorText);
      return;
    }

    const books = Object.values(searchResults.data.data);
    searchCtx.session = { results: books, state: "idle" };
    const stringResults = books.map((val) => {
      return `<a href="https://www.noor-book.com${val.url}">${escapeHtml(val.title)}</a>\n/dl_${escapeHtml(val.id)}\n\n------------------------------`;
    });

    const text = stringResults.join("\n");

    await ctx.api.editMessageText(
      ctx.chatId!,
      reply.message_id,
      `<b>نتائج البحث</b>\n<i>إضغط على الأمر أسفل أي كتاب لتحميّله.</i>\n\n${text}`,
      {
        parse_mode: "HTML",
        link_preview_options: {
          is_disabled: true,
        },
      },
    );
  } catch (error) {
    console.error(error);
  }
}
