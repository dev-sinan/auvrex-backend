import express from "express";
import multer from "multer";
import {
  signupUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js"; 

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }).any();

//  Public routes
router.post("/signup", upload, signupUser);
router.post("/login", upload, loginUser);

//  Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;
