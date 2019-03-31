import * as express from "express";

import { validationResult } from "express-validator/check";

/**
 * Models
 */
import { Category } from "../models/Category";
import { extractRestaurantId } from "../../../utils/util";

const CategoryModel = new Category().getModelForClass(Category);

export class CategoryController {
  async createOrUpdateCategory(
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

      const params = req.body as Category;
      const restaurantId = extractRestaurantId(req.baseUrl);

      let response: any;

      // is inserting a new document
      if (req.method !== "PATCH") {
        const newCategory = await new CategoryModel({
          ...params,
          restaurantId,
          createdAt: new Date()
        }).save();

        response = {
          _id: newCategory.id,
          ...params
        };
      } else {
        const _id = req.params.categoryId;

        if (!_id) {
          throw Error("You need to specify a valid name.");
        }

        const updateCategory = await CategoryModel.findOneAndUpdate(
          {
            _id
          },
          {
            ...params,
            restaurantId,
            updatedAt: new Date()
          },
          { upsert: true }
        );

        if (!updateCategory) {
          throw Error("Could not update restaurant.");
        }

        response = { ...params, restaurantId };
      }

      return res.json({ ...response });
    } catch (e) {
      next(e);
    }
  }

  getCategories = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const restaurantId = extractRestaurantId(req.baseUrl);

      const query = await CategoryModel.find({ restaurantId }, null, err => {
        if (err) throw err;
      });

      return res.json(query);
    } catch (e) {
      next(e);
    }
  };

  getCategory = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const restaurantId = extractRestaurantId(req.baseUrl);
      const _id = req.params.categoryId;

      const data = await CategoryModel.findById(
        { _id, restaurantId },
        (err, res) => {
          if (err) {
            return;
          }
        }
      );

      if (data === null) {
        throw Error("The category id does not exists.");
      }

      return res.json(data);
    } catch (e) {
      next(e);
    }
  };

  deleteCategory = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const _id = req.params.categoryId;

      if (!_id) {
        throw Error("Define a valid category id.");
      }

      const data = await CategoryModel.findOneAndDelete({ _id });

      if (data === null) {
        throw Error("The category id does not exists.");
      }

      return res.json({
        message: `${_id} have been deleted successfully.`
      });
    } catch (e) {
      next(e);
    }
  };
}
