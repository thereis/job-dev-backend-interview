import * as express from "express";
import * as validator from "validator";

import { validationResult } from "express-validator/check";

/**
 * Models
 */
import { Product } from "../models/Product";
import {
  checkIfIsValidWorkingDate,
  checkIfCategoryExists,
  extractRestaurantId
} from "../../../utils/util";

const ProductModel = new Product().getModelForClass(Product);

export class ProductController {
  async createOrUpdateProduct(
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

      const params = req.body as Product;
      const restaurantId = extractRestaurantId(req.baseUrl);

      if (!restaurantId) {
        throw Error("Restaurant id is does not exists.");
      }

      if (params.category) {
        if (!validator.isMongoId(params.category))
          throw Error("Not a valid category id.");

        let result = await checkIfCategoryExists(restaurantId, params.category);

        if (!result) throw Error("Category does not exists.");
      }

      // validate promotional condition
      if (params.promotion) {
        const { days, description, price } = params.promotion;

        if (!days || !description || !price) {
          throw new Error("Missing fields in promotion attribute.");
        }

        // validate available days
        checkIfIsValidWorkingDate(days);
      }

      let response: any;

      if (req.method !== "PATCH") {
        const newProduct = await new ProductModel({
          ...params,
          restaurantId,
          createdAt: new Date()
        }).save();

        response = {
          _id: newProduct.id,
          ...params
        };
      } else {
        const _id = req.params.productId;

        if (!_id) {
          throw Error("You need to specify a valid product id.");
        }

        const updateProduct = await ProductModel.findOneAndUpdate(
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

        if (!updateProduct) {
          throw Error("Could not update the product.");
        }

        response = { ...params };
      }

      return res.send({ ...response, restaurantId });
    } catch (e) {
      next(e);
    }
  }

  getProducts = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const restaurantId = extractRestaurantId(req.baseUrl);

      const query = await ProductModel.find({ restaurantId }, null, err => {
        if (err) throw err;
      });

      return res.json(query);
    } catch (e) {
      next(e);
    }
  };

  getProduct = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const restaurantId = extractRestaurantId(req.baseUrl);
      const _id = req.params.productId;

      const data = await ProductModel.findById(
        { _id, restaurantId },
        (err, res) => {
          if (err) {
            return;
          }
        }
      );

      if (data === null) {
        throw Error("The product does not exists.");
      }

      return res.json(data);
    } catch (e) {
      next(e);
    }
  };

  deleteProduct = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const _id = req.params.productId;
      console.log("_id: ", _id);

      const data = await ProductModel.findOneAndDelete({ _id });

      if (data === null) {
        throw Error("The product id does not exists.");
      }

      return res.json({
        message: `${_id} have been deleted successfully.`
      });
    } catch (e) {
      next(e);
    }
  };
}
