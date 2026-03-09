import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();
connectDB();

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://task-management-roan-nine.vercel.app",
        "https://task-management-416hh5hlg-rudra-744s-projects.vercel.app",
        "https://task-management-git-main-rudra-744s-projects.vercel.app",
      ];

      // Allow requests with no origin (like mobile apps or curl requests)
      // or if the origin is in our list of allowed origins
      // or if it matches the FRONTEND_URL env variable
      // or if it is a Vercel deployment ending in .vercel.app
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin === process.env.FRONTEND_URL ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
