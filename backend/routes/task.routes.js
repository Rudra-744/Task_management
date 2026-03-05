import express from "express";
import { createTask, getAllTasks, updateTask, deleteTask } from "../controller/task.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/", protectRoute, getAllTasks);
router.post("/", protectRoute, upload.single("image"), createTask);
router.put("/:id", protectRoute, upload.single("image"), updateTask);
router.delete("/:id", protectRoute, deleteTask);

export default router;
