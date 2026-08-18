import { type Bot } from "grammy";
import type { BotContext } from "../bot.ts";

async function initCommands(bot: Bot<BotContext>) {
  await bot.api.setMyCommands([
    { command: "start", description: "البدء" },
    { command: "search", description: "البحث عن كتاب" },
    { command: "help", description: "كيفية الإستخدام" },
    { command: "legal", description: "الصفة القانونية" },
    // { command: "settings", description: "الإعدادات" },
  ]);
}

export default initCommands;
