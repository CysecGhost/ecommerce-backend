import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { addOrderItems } from "../controllers/orderControllers.js";
import { getOrderById } from "../controllers/orderControllers.js";
import { getOrders } from "../controllers/orderControllers.js";

const router = express.Router();

router.route("/").post(protect, addOrderItems);

router.route("/").get(protect, getOrders);

router.route("/:id").get(protect, getOrderById);

export default router;
