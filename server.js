import express from "express";
import { configDotenv } from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const PORT = process.env.PORT || 8000;
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

app.listen(PORT, () => console.log("Server is running on port", PORT));
