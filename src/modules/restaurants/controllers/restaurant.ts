import * as express from "express";

import { validationResult } from "express-validator/check";

/**
 * Models
 */
import { Restaurant } from "../models/Restaurant";
import { checkIfIsValidWorkingDate } from "../../../utils/util";

const RestaurantModel = new Restaurant().getModelForClass(Restaurant);

export class RestaurantController {
  async createOrUpdateRestaurant(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      if (!req.body) {
        throw Error("Invalid body.");
      }

      if (!req.is("application/json")) {
        throw Error("Content-Type must be json.");
      }

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          error: true,
          message: errors.array()
        });
      }

      const params = req.body as Restaurant;

      const isValidWorkingDate = checkIfIsValidWorkingDate(params.activityDate);

      if (!isValidWorkingDate) {
        throw Error("Activity date has errors, check documentation.");
      }

      let response: any;

      // is inserting a new document
      if (req.method !== "PATCH") {
        const newRestaurant = await new RestaurantModel({
          ...params,
          createdAt: new Date()
        }).save();

        response = {
          _id: newRestaurant.id,
          ...params
        };
      } else {
        const _id = req.params.id;

        if (!_id) {
          throw Error("You need to specify a valid restaurant id.");
        }

        const updateRestaurant = await RestaurantModel.findOneAndUpdate(
          {
            _id
          },
          {
            ...params,
            updatedAt: new Date()
          },
          { upsert: true }
        );

        if (!updateRestaurant) {
          throw Error("Could not update restaurant.");
        }

        response = { ...params };
      }

      return res.json({ ...response });
    } catch (e) {
      next(e);
    }
  }

  getRestaurants = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const query = await RestaurantModel.find({}, null, err => {
        if (err) throw err;
      });

      return res.json(query);
    } catch (e) {
      next(e);
    }
  };

  getRestaurant = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const _id = req.params.id;

      const data = await RestaurantModel.findById(_id, (err, res) => {
        if (err) {
          return;
        }
      });

      if (data === null) {
        throw Error("The restaurant id does not exists.");
      }

      return res.json(data);
    } catch (e) {
      next(e);
    }
  };

  deleteRestaurant = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const _id = req.params.id;

      const data = await RestaurantModel.findOneAndDelete({ _id });

      if (data === null) {
        throw Error("The restaurant id does not exists.");
      }

      return res.json({
        message: `${_id} have been deleted successfully.`
      });
    } catch (e) {
      next(e);
    }
  };
}
