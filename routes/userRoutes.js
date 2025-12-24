import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getProfile,
  updateProfile,
} from "../controllers/userControllers.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;
