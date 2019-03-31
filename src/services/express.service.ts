import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "http";

import { RestaurantsRoutes } from "../modules/restaurants/restaurants";
import { CategoriesRoutes } from "../modules/categories/categories";

/**
 * Application routes
 */
class Service {
  app: express.Application = express();
  server?: http.Server;

  constructor() {}

  private config(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.app) {
        throw Error("Express is not initialized.");
      }

      // support application/json type post data
      this.app.use(bodyParser.json());
      this.app.use(express.json());

      //support application/x-www-form-urlencoded post data
      this.app.use(bodyParser.urlencoded({ extended: false }));

      // add routes
      this.app.use("/restaurants", RestaurantsRoutes);
      this.app.use("/restaurants/:id/categories", CategoriesRoutes);

      // add not found
      this.app.use(this.notFound);

      // add error handler
      this.app.use(this.errorHandler);

      resolve();
    });
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log("Starting express...");

        const PORT = process.env.PORT || 3000;

        if (!this.app) {
          throw Error("App is not initialized.");
        }

        // express configuration
        this.config();

        this.server = this.app.listen(PORT, () =>
          console.log(`Express running on port: ${PORT}`)
        );

        resolve();
      } catch (e) {
        console.log(e);
      }
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.server || !this.app) {
          throw new Error("Express service is not initialized.");
        }

        console.log("Closing express service...");
        this.server.close();
        console.log("Closed!");

        resolve();
      } catch (e) {
        console.log(e);
      }
    });
  }

  /**
   * Not found
   */
  notFound(req: express.Request, res: express.Response) {
    res.status(404).send({
      error: true,
      message: "The requested endpoint could not be found!"
    });
  }

  /**
   * Error handler
   */
  errorHandler(
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.status(422).send({
      error: true,
      message: err.message
    });
  }
}

export const ExpressService = new Service();
