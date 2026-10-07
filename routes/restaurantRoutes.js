import { Router } from "express";

import {
  getRestaurants,
  getFeaturedRestaurants,
  getRestaurantBySlug,
  getRestaurantAvailability,
  getRestaurantImage,
} from "../controllers/restaurantController.js";

const restaurantRouter = Router();

restaurantRouter.get(
  "/",
  getRestaurants
);

restaurantRouter.get(
  "/featured",
  getFeaturedRestaurants
);

// Restaurant image
// MUST come before /:slug
restaurantRouter.get(
  "/:id/image",
  getRestaurantImage
);

// Restaurant availability
restaurantRouter.get(
  "/:id/availability",
  getRestaurantAvailability
);

// Restaurant details
restaurantRouter.get(
  "/:slug",
  getRestaurantBySlug
);

export default restaurantRouter;
