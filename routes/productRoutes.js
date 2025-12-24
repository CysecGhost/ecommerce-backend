import express from "express";
import {
  getProducts,
  getTrending,
  getBestSellers,
  getFeatured,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
} from "../controllers/productControllers.js";

const router = express.Router();

// Get all products
router.get("/", getProducts);

// Get trending products
router.get("/trending", getTrending);

// Get best sellers
router.get("/best-sellers", getBestSellers);

// Get featured products
router.get("/featured", getFeatured);

// Get single product by id
router.get("/:id", getProductById);

// Create new product
router.post("/", createProduct);

// Update product by id
router.put("/:id", updateProductById);

// Delete product by id
router.delete("/:id", deleteProductById);

export default router;
