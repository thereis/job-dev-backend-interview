import { Router, Request, Response, NextFunction } from "express";
import { ProductController } from "./controllers/products";

import { check } from "express-validator/check";

import {
  validateRestaurantMiddleWare,
  asyncMiddleware
} from "../../utils/util";

class Route {
  router = Router();

  private productController: ProductController = new ProductController();

  constructor() {
    this.restaurants();
  }

  /**
   * Products routes
   */
  restaurants = () => {
    const validation = () => [
      check("name")
        .isString()
        .isLength({ min: 3, max: 50 }),
      check("photo")
        .isString()
        .isURL(),
      check("price").isNumeric(),
      check("category").isString()
    ];

    this.router.get(
      "/",
      asyncMiddleware(validateRestaurantMiddleWare),
      this.productController.getProducts
    );
    this.router.get(
      "/:productId",
      asyncMiddleware(validateRestaurantMiddleWare),
      this.productController.getProduct
    );

    // delete a product
    this.router.delete(
      "/:productId",
      asyncMiddleware(validateRestaurantMiddleWare),
      this.productController.deleteProduct
    );

    /**
     * Create or update a new product
     */
    this.router.post(
      "/",
      validation(),
      asyncMiddleware(validateRestaurantMiddleWare),
      this.productController.createOrUpdateProduct
    );

    this.router.patch(
      "/:productId",
      validation(),
      asyncMiddleware(validateRestaurantMiddleWare),
      this.productController.createOrUpdateProduct
    );
  };
}

export const ProductsRoutes = new Route().router;
