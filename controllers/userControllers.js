import mongoose from "mongoose";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import AppError from "../utils/AppError.js";
import generateToken from "../utils/jwt.js";

// Login User
export const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and Password are required"));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("Invalid credentials"));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new AppError("Invalid credentials"));
  }

  generateToken(res, user._id);

  res.status(200).json({ message: "Login successful", user });
});

// Register USER
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError("Fill the required fields", 400));
  }

  if (password.length < 6) {
    return next(new AppError("Password must be at least 6 characters", 400));
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new AppError("User already exists", 400));
  }

  const user = await User.create(req.body);

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({ message: "User created", user });
  } else {
    return next(new AppError("User not created", 400));
  }
});

// Logout USER
export const logoutUser = asyncHandler(async (req, res, next) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });

  res.json({ message: "User logged out" });
});

// GET Profile
export const getProfile = asyncHandler(async (req, res, next) => {
  const { name, email, phone, address } = req.user;

  const user = {
    _id: req.user._id,
    name,
    email,
    phone,
    address,
  };

  res.json(user);
});

// UPDATE Profile
export const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, email, phone, address } = req.body;

  const updates = {
    name,
    email,
    phone,
    address,
  };

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("User not found", 400));
  }

  res.json({ message: "User updated", user });
});
