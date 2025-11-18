import express from "express";
import multer from "multer";
import {
  signupUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  sendOtp,
  verifyOtp,
  resetPassword,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Multer for signup/login (if you add images later)
const upload = multer({ storage: multer.memoryStorage() });


//PUBLIC ROUTES//
router.post("/signup", upload.any(), signupUser);
router.post("/login", upload.any(), loginUser);

//  Forgot Password - OTP 
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);


// PROTECTED ROUTES  //
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;
