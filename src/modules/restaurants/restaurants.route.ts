import { Router } from "express";
import { RestaurantController } from "./controllers/restaurant";

import { check } from "express-validator/check";

class Route {
  router = Router();

  private restaurantController: RestaurantController = new RestaurantController();

  constructor() {
    this.restaurants();
  }

  /**
   * Restaurants routes
   */
  restaurants = () => {
    const validation = () => [
      check("name")
        .isString()
        .isLength({ min: 3, max: 50 }),
      check("address")
        .isString()
        .isLength({
          min: 5,
          max: 50
        }),
      check("photo").isURL(),
      check("activityDate").isArray()
    ];

    this.router.get("/", this.restaurantController.getRestaurants);
    this.router.get("/:id", this.restaurantController.getRestaurant);
    this.router.delete("/:id", this.restaurantController.deleteRestaurant);

    this.router.post(
      "/",
      validation(),
      this.restaurantController.createOrUpdateRestaurant
    );
    this.router.patch(
      "/:id",
      validation(),
      this.restaurantController.createOrUpdateRestaurant
    );
  };
}

export const RestaurantsRoutes = new Route().router;
