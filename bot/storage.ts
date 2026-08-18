import { enhanceStorage } from "grammy";
import { MongoDBAdapter, type ISession } from "@grammyjs/storage-mongodb";
import mongoose from "mongoose";

const collection = mongoose.connection.collection<ISession>("sessions") as any;

const MongoStorage = enhanceStorage({
  storage: new MongoDBAdapter<ISession>({ collection }) as any,
  millisecondsToLive: 5 * 60 * 1000,
});

export default MongoStorage;
