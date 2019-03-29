/**
 * Services
 */
import { ExpressService, MongoService } from "./services";

class Server {
  constructor() {
    console.log("Starting server...");
  }

  start(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Express service
        await ExpressService.start();

        // Database service
        await MongoService.start();
      } catch (e) {
        console.log(e.message);
      }
    });
  }
}

export const ServerInstance = new Server().start();
