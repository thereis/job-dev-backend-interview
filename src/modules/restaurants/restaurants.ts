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

    // get all registered restaurants
    this.router.get("/", this.restaurantController.getRestaurants);

    // insert a new restaurant
    this.router.post("/", validation, this.restaurantController.newRestaurant);

    // get a specific restaurant
    this.router.get("/:id", this.restaurantController.getRestaurant);

    // delete a restaurant
    this.router.delete("/:id", this.restaurantController.deleteRestaurant);
  };
}

export const RestaurantsRoutes = new Route().router;
