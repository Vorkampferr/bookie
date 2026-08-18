import type { queryResult } from "./bot.ts";

export interface SessionData {
  results: queryResult[];
  state: string;
}
