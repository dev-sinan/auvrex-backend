import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  img: String,
  size: String,
  quantity: { type: Number, default: 1 },
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
