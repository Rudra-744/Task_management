import User from "../models/User.js";
import Task from "../models/Task.js";
import fs from "fs";
import { sendTaskEmail } from "../config/email.js";

// GET all users (employees + project managers)
export const getAllUsers = async (req, res) => {
  try {
    let query;
    if (req.user.role === "admin") {
      query = { role: { $ne: "admin" }, _id: { $ne: req.user._id } };
    } else {
      query = { role: "employee", _id: { $ne: req.user._id } };
    }
    const users = await User.find(query).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getAllUsers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET all tasks — admin/PM dekh sakta hai
export const getAllTasksAdmin = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.log("Error in getAllTasksAdmin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST — task banao aur assign karo employee ko
export const assignTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!assignedTo)
      return res
        .status(400)
        .json({ message: "Please select a user to assign" });

    const user = await User.findById(assignedTo);
    if (!user) return res.status(404).json({ message: "User not found" });

    const task = new Task({
      title,
      description,
      assignedTo, // employee/intern ka ID
      createdBy: req.user.id, // admin/PM ka ID
      user: assignedTo, // backward compatibility
      attachmentUrl: req.file ? req.file.path : "", // Cloudinary URL
      attachmentName: req.file ? req.file.originalname : "",
      image: req.file?.filename || "", // Keep for backward compatibility if needed, though req.file.filename in cloudinary is the public_id
    });

    await task.save();

    // Send email in background (non-blocking) - don't wait for it
    sendTaskEmail(task, "assigned", user.email).catch((err) =>
      console.log("Email send failed (task still saved):", err.message)
    );

    res.status(201).json({ message: "Task assigned successfully!", task });
  } catch (error) {
    console.log("Error in assignTask:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE task — admin/PM koi bhi task delete kar sakte hain
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // No need to delete local files as they are on Cloudinary now
    // Future enhancement: Delete from Cloudinary using public_id if needed

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log("Error in deleteTask:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE user + unke saare tasks
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // No need to delete local files as they are on Cloudinary now
    await Task.deleteMany({ assignedTo: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Error in deleteUser:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PUT — user ka role change karo
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["admin", "project_manager", "employee"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true },
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Role updated successfully", user });
  } catch (error) {
    console.log("Error in updateUserRole:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;

    const updateData = { title, description, assignedTo };

    if (req.file) {
      updateData.attachmentUrl = req.file.path; // Cloudinary URL
      updateData.attachmentName = req.file.originalname;
      updateData.image = req.file.filename;
    }

    const task = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.log("Error in updateTask:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
