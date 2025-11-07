import express from "express";
import {
  getCartItems,
  addOrUpdateCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

//  Routes
router.get("/", getCartItems);
router.post("/", addOrUpdateCartItem);
router.put("/:id", updateCartItem);
router.delete("/:id", deleteCartItem);
router.delete("/", clearCart);

export default router;
