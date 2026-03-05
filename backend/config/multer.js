import multer from "multer";
import path from "path";

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "task_manager_uploads",
    resource_type: "auto", // automatically detect if it is an image or raw file (pdf, docx etc)
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
    ".xlsx",
    ".xls",
    ".ppt",
    ".pptx",
    ".jpg",
    ".jpeg",
    ".png",
  ];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true); // ✅ Accept the file
  } else {
    cb(
      new Error(
        "Only documents (PDF, DOC, DOCX, XLSX, XLS, PPT, PPTX) and images (JPG, JPEG, PNG) are allowed!",
      ),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Max 5MB per file
  },
});

export default upload;
