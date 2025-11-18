import express from "express";
import {
  getCartItems,
  addOrUpdateCartItem,
  decreaseCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

// Routes
router.get("/", getCartItems);
router.post("/", addOrUpdateCartItem);
router.put("/decrease", decreaseCartItem); // 👈 new route for - button
router.put("/update", updateCartItem);
router.delete("/item", deleteCartItem);
router.delete("/", clearCart);

export default router;
