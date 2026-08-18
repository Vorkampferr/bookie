import type { Context } from "grammy";
import type { SessionData } from "./sessions.ts";

export type SearchContext = Context & {
  session: SessionData;
};
