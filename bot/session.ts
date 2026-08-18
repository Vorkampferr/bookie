import { session } from "grammy";
import MongoStorage from "./storage";
import type { SessionData } from "../types/sessions";

function initialResults(): SessionData {
  return { results: [], state: "idle" };
}

const sessionMiddleware = session({
  initial: initialResults,
  storage: MongoStorage,
});

export default sessionMiddleware;
