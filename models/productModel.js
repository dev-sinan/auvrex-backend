import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  size: { type: [String], default: [] }, 
  price: { type: Number, required: true },
  image: { type: String, required: true },
  public_id: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
