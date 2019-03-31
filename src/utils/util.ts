import * as moment from "moment";
import * as validator from "validator";
import * as express from "express";

/**
 * Models
 */
import { Restaurant } from "../modules/restaurants/models/Restaurant";
import { Category } from "../modules/categories/models/Category";

/**
 * Interfaces
 */
import { IWorkingDays } from "../modules/restaurants/models/Restaurant";

export const asyncMiddleware = (fn: any) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const validateRestaurantMiddleWare = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // Restaurant validation
  const restaurantId = extractRestaurantId(req.baseUrl);

  if (!restaurantId) {
    throw Error("Restaurant id is not valid.");
  }

  let restaurantExists = await checkIfRestaurantExists(restaurantId);
  if (!restaurantExists) {
    throw Error("Restaurant does not exists.");
  }

  next();
};

export const isValidUtcDate = (date: string) => {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(date)) return false;
  var d = new Date(date);
  return d.toISOString() === date;
};

export const checkIfIsValidWorkingDate = (dates: IWorkingDays[]) => {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
  ];

  if (dates.length === 0) {
    throw Error("Dates must not be empty.");
  }

  dates.forEach(date => {
    const { dayOfWeek, times } = date;

    if (!dayOfWeek) {
      throw Error("Day of week is not defined");
    }

    if (!times) {
      throw Error("Times is not defined.");
    }

    const isDateRange = dayOfWeek.includes("-");

    if (isDateRange) {
      const splittedDays = dayOfWeek.split("-");

      splittedDays.forEach(day => {
        day = day.toLowerCase();

        if (!days.includes(day)) {
          throw Error("Not a valid week day.");
        }
      });
    } else {
      if (!days.includes(dayOfWeek.toLowerCase())) {
        throw Error("Not a valid week day.");
      }
    }

    if (!times["start"] || !times["end"]) {
      throw Error("start or end is not defined for times.");
    }

    const isValidStartTime = moment(times.start, "HH:mm", true);
    const isValidEndTime = moment(times.end, "HH:mm", true);

    if (!isValidStartTime.isValid() || !isValidEndTime.isValid()) {
      throw Error(
        "Check if the start and end parameters are valid hour:minute."
      );
    }

    let diff = moment(isValidEndTime).diff(isValidStartTime, "minutes");

    if (diff < 15) {
      throw Error("This restaurant need to be opened for at least 15 minutes.");
    }
  });

  return true;
};

export const extractRestaurantId = (url: string) => {
  let path = url.split("/");

  return path.find(arg => validator.isMongoId(arg));
};

export const checkIfRestaurantExists = async (restaurantId: string) => {
  const RestaurantModel = new Restaurant().getModelForClass(Restaurant);

  let result = await RestaurantModel.findOne({ _id: restaurantId });

  return result !== null;
};

export const checkIfCategoryExists = async (
  restaurantId: string,
  categoryId: string
) => {
  const restaurantExists = await checkIfRestaurantExists(restaurantId);

  if (!restaurantExists) {
    throw new Error("Could not find a restaurant with specified id.");
  }

  const CategoryModel = new Category().getModelForClass(Category);

  let result = await CategoryModel.findOne({ _id: categoryId, restaurantId });

  return result !== null;
};
