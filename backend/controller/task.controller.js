import Task from "../models/Task.js";
import { sendTaskEmail } from "../config/email.js";
import fs from "fs";

export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTask = new Task({
      title,
      description,
      image: req.file?.filename || "",
      user: req.user.id,
    });
    await newTask.save();
    await sendTaskEmail(newTask, "created", req.user.email);
    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user.id,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const isOwner = task.user?.toString() === req.user.id;
    const isAssigned = task.assignedTo?.toString() === req.user.id;
    if (!isOwner && !isAssigned) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    task.title = title || task.title;
    task.description = description || task.description;
    task.completed = completed !== undefined ? completed : task.completed;
    await task.save();
    if (completed === true || completed === "true") {
      await sendTaskEmail(task, "completed", req.user.email);
    }
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (task.image) {
      fs.unlinkSync(`uploads/${task.image}`);
    }
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
