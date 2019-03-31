import { Router } from "express";

import { check } from "express-validator/check";

import { CategoryController } from "../categories/controllers/category";
import {
  asyncMiddleware,
  validateRestaurantMiddleWare
} from "../../utils/util";

class Route {
  router = Router();

  private categoryController: CategoryController = new CategoryController();

  constructor() {
    this.categories();
  }

  /**
   * Categories routes
   */
  categories = () => {
    const validation = () => [
      check("name")
        .isString()
        .isLength({ min: 3, max: 50 })
    ];

    /**
     * Categories
     */
    this.router.get(
      "/",
      asyncMiddleware(validateRestaurantMiddleWare),
      this.categoryController.getCategories
    );
    this.router.get(
      "/:categoryId",
      asyncMiddleware(validateRestaurantMiddleWare),
      this.categoryController.getCategory
    );
    this.router.delete(
      "/:categoryId",
      asyncMiddleware(validateRestaurantMiddleWare),
      this.categoryController.deleteCategory
    );
    this.router.post(
      "/",
      validation(),
      asyncMiddleware(validateRestaurantMiddleWare),
      this.categoryController.createOrUpdateCategory
    );
    this.router.patch(
      "/:categoryId",
      validation(),
      asyncMiddleware(validateRestaurantMiddleWare),
      this.categoryController.createOrUpdateCategory
    );
  };
}

export const CategoriesRoutes = new Route().router;
