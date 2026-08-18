import mongoose from "mongoose";

async function connectDB() {
  mongoose.set("autoIndex", process.env.NODE_ENV !== "production");
  mongoose.set("autoCreate", false);

  mongoose.connection.on("connected", () =>
    console.log("Connected to the MongoDB"),
  );
  mongoose.connection.on("disconnected", () =>
    console.log("Disconnected from the MongoDB"),
  );
  mongoose.connection.on("reconnected", () =>
    console.log(
      "Reconnected to the MongoDB [Check logs for possible throttles]",
    ),
  );

  try {
    const db = await mongoose.connect(process.env.MONGO_URI!, {
      appName: "bookie",
      compressors: "zlib",
      connectTimeoutMS: 20000,
      noDelay: true,
      serverSelectionTimeoutMS: 20000,
    });

    mongoose.connection.on("error", (err) => {
      console.error(err);
    });

    return db;
  } catch (error: any) {
    console.error(error);
    return error;
  }
}

export default connectDB;
