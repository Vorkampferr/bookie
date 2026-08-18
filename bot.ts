import dotenv from "dotenv";
import connectDB from "./db/index.ts";

import { Bot, Context, type SessionFlavor } from "grammy";
import { run } from "@grammyjs/runner";
import initCommands from "./bot/commands.ts";

import { handleError } from "./bot/handlers/error.ts";
import { handleSearch } from "./bot/handlers/search.ts";
import { handleOther } from "./bot/handlers/other.ts";
import { dlCommandRegex, hanldeDownload } from "./bot/handlers/download.ts";
import { handleStart } from "./bot/handlers/start.ts";
import { handleHelp } from "./bot/handlers/help.ts";

import limiter from "./bot/ratelimiter.ts";
import sessionMiddleware from "./bot/session.ts";
import type { SessionData } from "./types/sessions.ts";
import { ignoreOld } from "grammy-middlewares";
import { handleLegal } from "./bot/handlers/legal.ts";
import verifySubscription from "./bot/verify.ts";

dotenv.config();

const BOT_TOKEN: string = process.env.BOT_TOKEN!;

await connectDB();

export type BotContext = Context & SessionFlavor<SessionData>;
const bot = new Bot<BotContext>(BOT_TOKEN);

bot.use(ignoreOld());
bot.use(limiter);
bot.use(sessionMiddleware);
bot.use(verifySubscription);

await initCommands(bot);

bot.hears(dlCommandRegex, hanldeDownload);
bot.command("start", handleStart);
bot.command("search", handleSearch);
bot.command("help", handleHelp);
bot.command("legal", handleLegal);

bot.on("message", handleOther);

bot.catch(handleError);

const runner = run(bot);

const stopRunner = () => runner.isRunning() && runner.stop();
process.once("SIGINT", stopRunner);
process.once("SIGTERM", stopRunner);

export default bot;
