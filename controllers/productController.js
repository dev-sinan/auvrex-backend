import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";

// 🟩 Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "✅ Fetched all products successfully", products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟨 Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "✅ Product fetched successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟦 Add (upload) product
export const addProduct = async (req, res) => {
  let imageUrl;
  try {
    const { name, category, size, price } = req.body;

    if (!req.file) return res.status(400).json({ message: "No image uploaded" });
    if (!name || !category || !price)
      return res.status(400).json({ message: "Name, category, and price are required" });

    // ✅ Convert size to array
    const sizeArray = typeof size === "string"
      ? size.split(",").map(s => s.trim())
      : Array.isArray(size)
      ? size
      : [];

    imageUrl = req.file.path; 

    const product = await Product.create({
      name,
      category,
      price,
      size: sizeArray,
      image: imageUrl,
    });

    res.status(201).json({ message: "✅ Product added successfully", product });
  } catch (error) {
    if (imageUrl) {
      const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
      
    }
    res.status(500).json({ message: error.message });
  }
};

// 🟨 Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, size, price } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const sizeArray = typeof size === "string"
      ? size.split(",").map(s => s.trim())
      : Array.isArray(size)
      ? size
      : undefined;

    if (req.file) {
      const oldPublicId = product.image.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(oldPublicId);
      product.image = req.file.path;
    }

    if (name) product.name = name;
    if (category) product.category = category;
    if (price) product.price = price;
    if (sizeArray) product.size = sizeArray;

    await product.save();
    res.status(200).json({ message: "✅ Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟥 Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const publicId = product.image.split("/").slice(-2).join("/").split(".")[0];
    await cloudinary.uploader.destroy(publicId);
    await product.deleteOne();

    res.status(200).json({ message: "🗑️ Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


