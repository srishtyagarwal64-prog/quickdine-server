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

// Image route MUST come before /:slug
restaurantRouter.get(
  "/:id/image",
  getRestaurantImage
);

restaurantRouter.get(
  "/:id/availability",
  getRestaurantAvailability
);

restaurantRouter.get(
  "/:slug",
  getRestaurantBySlug
);

export default restaurantRouter;
