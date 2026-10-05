
import { Restaurant } from "../models/Restaurant.js";
import { Booking } from "../models/Booking.js";

// Get owner's restaurant
// GET /api/owner/restaurant
// @access Private/Owner
export const getOwnerRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({
            owner: req.user?._id,
        });

        if (!restaurant) {
            res.status(200).json(null);
            return;
        }

        res.json(restaurant);
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: error.message,
        });
    }
};

// Create owner's restaurant
// POST /api/owner/restaurant
// @access Private/Owner
export const createOwnerRestaurant = async (req, res) => {
    try {
        const existing = await Restaurant.findOne({
            owner: req.user?._id,
        });

        if (existing) {
            res.status(400).json({
                message: "You already have a restaurant registered",
            });
            return;
        }

        const {
            name,
            description,
            cuisine,
            priceRange,
            location,
            address,
            chef,
            tags,
            availableSlots,
            totalSeats,
        } = req.body;

        if (
            !name ||
            !description ||
            !cuisine ||
            !priceRange ||
            !location ||
            !address ||
            !chef
        ) {
            res.status(400).json({
                message: "Please provide all required fields",
            });
            return;
        }

        // Generate slug
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

        const slugExists = await Restaurant.findOne({ slug });

        if (slugExists) {
            res.status(400).json({
                message: "A restaurant with this name already exists",
            });
            return;
        }

        // Handle image using Multer
        let imageUrl = "";

        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        // Parse tags
        const parsedTags =
            typeof tags === "string"
                ? tags.split(",").map((t) => t.trim())
                : tags || [];

        // Parse available slots
        const parsedSlots =
            typeof availableSlots === "string"
                ? availableSlots.split(",").map((s) => s.trim())
                : availableSlots || [
                      "17:00",
                      "18:00",
                      "19:00",
                      "20:00",
                      "21:00",
                  ];

        const restaurant = await Restaurant.create({
            name,
            slug,
            description,
            cuisine,
            priceRange,
            location,
            address,
            chef,

            // Image saved by Multer
            image: imageUrl,

            tags: parsedTags,
            availableSlots: parsedSlots,
            totalSeats: totalSeats ? Number(totalSeats) : 20,

            owner: req.user?._id,

            // Pending until admin approves
            status: "pending",
        });

        res.status(201).json(restaurant);
    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: error.message,
        });
    }
};

// Update owner's restaurant
// PUT /api/owner/restaurant
// @access Private/Owner
export const updateOwnerRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({
            owner: req.user?._id,
        });

        if (!restaurant) {
            res.status(404).json({
                message: "Restaurant profile not found",
            });
            return;
        }

        const {
            name,
            description,
            cuisine,
            priceRange,
            location,
            address,
            chef,
            tags,
            availableSlots,
            totalSeats,
        } = req.body;

        if (name) {
            restaurant.name = name;
        }

        if (description) {
            restaurant.description = description;
        }

        if (cuisine) {
            restaurant.cuisine = cuisine;
        }

        if (priceRange) {
            restaurant.priceRange = priceRange;
        }

        if (location) {
            restaurant.location = location;
        }

        if (address) {
            restaurant.address = address;
        }

        if (chef) {
            restaurant.chef = chef;
        }

        if (totalSeats) {
            restaurant.totalSeats = Number(totalSeats);
        }

        if (tags) {
            restaurant.tags =
                typeof tags === "string"
                    ? tags.split(",").map((t) => t.trim())
                    : tags;
        }

        if (availableSlots) {
            restaurant.availableSlots =
                typeof availableSlots === "string"
                    ? availableSlots.split(",").map((s) => s.trim())
                    : availableSlots;
        }

        // Handle new image using Multer
        if (req.file) {
            restaurant.image = `/uploads/${req.file.filename}`;
        }

        const updated = await restaurant.save();

        res.json(updated);
    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: error.message,
        });
    }
};

// Get bookings for owner's restaurant
// GET /api/owner/bookings
// @access Private/Owner
export const getOwnerBookings = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({
            owner: req.user?._id,
        });

        if (!restaurant) {
            res.status(404).json({
                message: "Restaurant profile not found",
            });
            return;
        }

        const bookings = await Booking.find({
            restaurant: restaurant._id,
        })
            .populate("user", "name email phone")
            .sort({
                date: -1,
                time: -1,
            });

        res.json(bookings);
    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: error.message,
        });
    }
};

// Update booking status
// PUT /api/owner/bookings/:id/status
// @access Private/Owner
export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (
            !status ||
            !["confirmed", "cancelled", "completed"].includes(status)
        ) {
            res.status(400).json({
                message: "Please enter a valid booking status",
            });
            return;
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            res.status(404).json({
                message: "Booking not found",
            });
            return;
        }

        // Check whether booking belongs to owner's restaurant
        const restaurant = await Restaurant.findById(
            booking.restaurant
        );

        if (
            !restaurant ||
            restaurant.owner.toString() !== req.user?._id.toString()
        ) {
            res.status(401).json({
                message: "Not authorized to manage this booking",
            });
            return;
        }

        booking.status = status;

        await booking.save();

        res.json(booking);
    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: error.message,
        });
    }
};

