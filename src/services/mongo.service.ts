import * as mongoose from "mongoose";

class Service {
  mongooseInstance?: typeof mongoose;

  constructor() {}

  start(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("Connecting to mongo...");

        this.mongooseInstance = await mongoose.connect(
          `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${
            process.env.DB_HOST
          }/${process.env.DB_DATABASE}?retryWrites=true`,
          { useNewUrlParser: true }
        );

        console.log("Connected!");
        resolve();
      } catch (e) {
        throw e;
      }
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.mongooseInstance) {
          throw new Error("Mongo service is not initialized.");
        }

        console.log("Disconnecting from mongo service...");

        this.mongooseInstance.disconnect();

        console.log("Disconnected!");
        resolve();
      } catch (e) {
        console.log(e);
      }
    });
  }
}

export const MongoService = new Service();
