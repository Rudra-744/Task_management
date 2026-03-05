import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import User from "./models/User.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

// Load env variables
dotenv.config();

// Admin credentials
const ADMIN_NAME = "Super Admin";
const ADMIN_EMAIL = "admin@dotit.com";
const ADMIN_PASSWORD = "admin123";

// PM credentials
const PM_NAME = "Project Manager";
const PM_EMAIL = "pm@dotit.com";
const PM_PASSWORD = "pm123456";

const seedUsers = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const salt = await bcryptjs.genSalt(10);

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log("⚠️  Admin already exists! Login with:");
      console.log(`   Email: ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
    } else {
      const hashedPassword = await bcryptjs.hash(ADMIN_PASSWORD, salt);
      await new User({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
      }).save();
      console.log("✅ Admin account created!");
      console.log(`   Email: ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
    }

    const existingPM = await User.findOne({ email: PM_EMAIL });

    if (existingPM) {
      console.log("⚠️  Project Manager already exists! Login with:");
      console.log(`   Email: ${PM_EMAIL}`);
      console.log(`   Password: ${PM_PASSWORD}`);
    } else {
      const hashedPassword = await bcryptjs.hash(PM_PASSWORD, salt);
      await new User({
        name: PM_NAME,
        email: PM_EMAIL,
        password: hashedPassword,
        role: "project_manager",
      }).save();
      console.log("✅ Project Manager account created!");
      console.log(`   Email: ${PM_EMAIL}`);
      console.log(`   Password: ${PM_PASSWORD}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();
