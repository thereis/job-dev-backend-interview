import * as express from "express";
import * as validator from "validator";

import { validationResult } from "express-validator/check";

/**
 * Models
 */
import { Product } from "../models/Product";
import {
  checkIfIsValidWorkingDate,
  checkIfCategoryExists
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

      if (params.category) {
        if (!validator.isMongoId(params.category))
          throw Error("Not a valid category id.");

        let result = await checkIfCategoryExists(params.category);

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
            updatedAt: new Date()
          },
          { upsert: true }
        );

        if (!updateProduct) {
          throw Error("Could not update the product.");
        }

        response = { ...params };
      }

      return res.send({ ...response });
    } catch (e) {
      next(e);
    }
  }
}
