import express from "express";
import {
  signup,
  login,
  getMe,
  logout,
  updateProfile,
  changePassword,
} from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", getMe);
router.post("/logout", logout);
router.put("/profile", protectRoute, updateProfile);
router.put("/change-password", protectRoute, changePassword);

export default router;
