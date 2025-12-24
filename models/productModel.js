import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Please add an image"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      trim: true,
    },
    tags: {
      type: [String],
    },
    brand: {
      type: String,
      required: [true, "Please add a brand"],
      trim: true,
    },
    stock: {
      type: String,
      required: [true, "Please add a stock"],
      trim: true,
    },
    countInStock: {
      type: Number,
      required: [true, "Please add a countInStock"],
      trim: true,
    },
    color: {
      type: String,
      required: [true, "Please add a color"],
      trim: true,
    },
    warranty: {
      type: String,
      required: [true, "Please add a warranty"],
      trim: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
