import express from "express";
import { configDotenv } from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

configDotenv();

// Connect to DB
connectDB();

const app = express();

// important for cookies on Render
app.set("trust proxy", 1);

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CookieParser
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Error Handler
app.use(notFound);
app.use(errorHandler);

app.listen(8000, "0.0.0.0", () => console.log("Server is running on 8000"));
