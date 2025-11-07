import express from "express";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// 🟩 Get all products
router.get("/", getProducts);

// 🟨 Get single product by ID
router.get("/:id", getProductById);

// 🟦 Add product (with image upload)
router.post("/", upload.single("image"), addProduct); // ✅ use single, not array

// 🟨 Update product (with image upload)
router.put("/:id", upload.single("image"), updateProduct); // ✅ same here

// 🟥 Delete product
router.delete("/:id", deleteProduct);

export default router;
