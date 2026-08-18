import type { Context } from "grammy";
import type { SessionData } from "./sessions";

export type SearchContext = Context & {
  session: SessionData;
};
