import express from "express";
import {
  getAllUsers,
  getAllTasksAdmin,
  assignTask,
  deleteUser,
  updateUserRole,
  deleteTask,
  updateTask,
} from "../controller/admin.controller.js";
import { protectAdminRoute } from "../middleware/auth.middleware.js";
import { adminOnly, adminOrPM } from "../middleware/admin.middleware.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/users", protectAdminRoute, adminOrPM, getAllUsers);

router.get("/tasks", protectAdminRoute, adminOrPM, getAllTasksAdmin);

router.delete("/tasks/:id", protectAdminRoute, adminOrPM, deleteTask);

router.put(
  "/tasks/:id",
  protectAdminRoute,
  adminOrPM,
  upload.single("file"),
  updateTask,
);

router.post(
  "/assign-task",
  protectAdminRoute,
  adminOrPM,
  upload.single("file"), // Updated to 'file' instead of 'image'
  assignTask,
);

router.delete("/users/:id", protectAdminRoute, adminOnly, deleteUser);

router.put("/users/:id/role", protectAdminRoute, adminOnly, updateUserRole);

export default router;
