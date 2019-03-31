import { Router } from "express";

import { check } from "express-validator/check";

import { CategoryController } from "../categories/controllers/category";

class Route {
  router = Router();

  private categoryController: CategoryController = new CategoryController();

  constructor() {
    this.categories();
  }

  /**
   * Restaurants routes
   */
  categories = () => {
    const categoryValidation = () => [
      check("name")
        .isString()
        .isLength({ min: 3, max: 50 })
    ];

    /**
     * Categories
     */
    this.router.get("/", this.categoryController.getCategories);
    this.router.get("/:categoryId", this.categoryController.getCategory);
    this.router.delete("/:categoryId", this.categoryController.deleteCategory);
    this.router.post(
      "/",
      categoryValidation(),
      this.categoryController.createOrUpdateCategory
    );
    this.router.patch(
      "/:categoryId",
      categoryValidation(),
      this.categoryController.createOrUpdateCategory
    );
  };
}

export const CategoriesRoutes = new Route().router;
