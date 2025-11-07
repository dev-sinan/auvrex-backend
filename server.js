import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();
connectDB(); 

const app = express();

// middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// routes
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/api/products", productRoutes);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
