import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import AppError from "../utils/AppError.js";
import Product from "../models/productModel.js";

// @desc Get all products
// @route GET /api/products
// @access Public
export const getProducts = asyncHandler(async (req, res, next) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(Number(req.query.limit) || 12, 100);
  const skip = (page - 1) * limit;

  // Keyword filtering
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  // Category filtering
  const category = req.query.category
    ? {
        category: {
          $in: req.query.category.split(","),
        },
      }
    : {};

  // Price Range
  let priceRange = {};
  let priceFilter = {};

  if (req.query.minPrice) priceRange.$gte = Number(req.query.minPrice);
  if (req.query.maxPrice) priceRange.$lte = Number(req.query.maxPrice);

  if (Object.keys(priceRange).length > 0) {
    priceFilter = { price: priceRange };
  }

  // Filter obj
  const filter = { ...keyword, ...category, ...priceFilter };

  const sortParam = req.query.sort || "newest";
  let sortObj = {};

  switch (sortParam) {
    case "price_asc":
      sortObj = { price: 1 };
      break;

    case "price_desc":
      sortObj = { price: -1 };
      break;

    case "top_sellers":
      sortObj = { viewCount: -1, rating: -1 };
      break;

    case "recommended":
      sortObj = { isRecommended: -1, rating: -1 };
      break;

    default:
      sortObj = { createdAt: -1 };
      break;
  }

  // Count total matching documents
  const count = await Product.countDocuments(filter);

  // Get price range
  const results = (await Product.aggregate([
    { $match: { ...category, ...keyword } },
    {
      $group: {
        _id: null,
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
  ])) || [{}];

  const products = await Product.find(filter)
    .sort(sortObj)
    .skip(skip)
    .limit(limit);

  console.log("Filter being applied:", filter);

  res.json({
    products,
    page,
    pages: Math.ceil(count / limit),
    count,
    priceRange: {
      min: results[0]?.minPrice ?? 0,
      max: results[0]?.maxPrice ?? 0,
    },
  });
});

// @desc Get Trending
// @route GET /api/products/trending
// @access Public
export const getTrending = asyncHandler(async (req, res, next) => {
  const trending = await Product.find().sort({ viewCount: -1 }).limit(15);

  if (trending.length === 0) {
    return next(new AppError("Products not found", 404));
  }

  res.json(trending);
});

// @desc Get best sellers
// @route GET /api/products/best-sellers
// @access Public
export const getBestSellers = asyncHandler(async (req, res, next) => {
  const bestSellers = await Product.find({ tags: { $in: ["bestSeller"] } });

  if (bestSellers.length === 0) {
    return next(new AppError("Products not found", 404));
  }

  res.json(bestSellers);
});

export const getFeatured = asyncHandler(async (req, res, next) => {
  const featured = await Product.find({ tags: { $in: ["featured"] } });

  if (featured.length === 0) {
    return next(new AppError("Products not found", 404));
  }

  res.json(featured);
});

// @desc Get single product
// @route GET /api/products/:id
// @access Public
export const getProductById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  // Check if id is a valid ObjectId before querying
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid product ID", 400));
  }

  const product = await Product.findById(id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  product.viewCount += 1;
  await product.save();
  res.json(product);
});

// @desc Create new product
// @route POST /api/products
// @access Private/Admin
export const createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, image, category, tags } = req.body;

  if (!name || !description || !price || !image || !category) {
    return next(new AppError("All fields are required", 400));
  }

  const product = await Product.create(req.body);
  res.status(201).json(product);
});

// @desc Update product
// @route PUT /api/products/:id
// @access Private/Admin
export const updateProductById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  // Check if id is a valid ObjectId before querying
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid product ID", 400));
  }

  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json(product);
});

// @desc Delete product
// @route DELETE /api/products/:id
// @access Private/Admin
export const deleteProductById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  // Check if id is a valid ObjectId before querying
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid product ID", 400));
  }

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(new AppError("Product now found", 404));
  }

  res.json({ message: "Product deleted" });
});
