import { limit } from "@grammyjs/ratelimiter";
import type { Context } from "grammy";

const limiter = limit({
  timeFrame: 2000,
  limit: 3,
  onLimitExceeded: async (ctx: Context) => {
    await ctx.reply("الرجاء عدم إرسال عدة رسائل وإلا قد تتعرض للحظر.");
  },
  keyGenerator: (ctx) => {
    return ctx.from?.id.toString();
  },
});

export default limiter;
