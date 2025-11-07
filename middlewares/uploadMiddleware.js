import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Configure storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png" ,"webp"],
  },
});

export const upload = multer({ storage });
