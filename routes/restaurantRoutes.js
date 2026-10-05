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


restaurantRouter.get(
    "/:slug",
    getRestaurantBySlug
);


restaurantRouter.get(
    "/:id/image",
    getRestaurantImage
);


restaurantRouter.get(
    "/:id/availability",
    getRestaurantAvailability
);


export default restaurantRouter;
