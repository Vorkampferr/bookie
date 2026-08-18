import type { queryResult } from "./bot";

export interface SessionData {
  results: queryResult[];
  state: string;
}
