import { session } from "grammy";
import MongoStorage from "./storage.ts";
import type { SessionData } from "../types/sessions.ts";

function initialResults(): SessionData {
  return { results: [], state: "idle" };
}

const sessionMiddleware = session({
  initial: initialResults,
  storage: MongoStorage,
});

export default sessionMiddleware;
