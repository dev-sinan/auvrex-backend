import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/jwt.js";
import nodemailer from "nodemailer";
import OTP from "../models/otpModel.js";


//  Signup

export const signupUser = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    if (!name || !mobile || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exist = await User.findOne({ $or: [{ mobile }, { email }] });
    if (exist) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      mobile,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Signup successful",
      user: { id: user._id, name: user.name, mobile: user.mobile, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


//  Login

export const loginUser = async (req, res) => {
  try {
    const { mobileOrEmail, password } = req.body;

    const user = await User.findOne({
      $or: [{ mobile: mobileOrEmail }, { email: mobileOrEmail }],
    });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, mobile: user.mobile, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


//  Get Profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Update Profile

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.mobile = req.body.mobile || user.mobile;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


//  Change Password (User Logged In)
export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Both passwords required" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// 🔹 Send OTP (Signup user check + Gmail SMTP secure)
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email not found" });

    const otp = Math.floor(100000 + Math.random() * 900000);

    await OTP.findOneAndUpdate(
      { email },
      { otp, email, createdAt: Date.now() },
      { upsert: true }
    );

    // Gmail SMTP Transport (Using .env)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. Valid for 5 minutes.`,
    });

    res.json({ message: "OTP sent to your email" });

  } catch (error) {
    console.log("OTP ERROR:", error.message);
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
};


//  Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord || otpRecord.otp != otp)
      return res.status(400).json({ message: "Invalid OTP" });

    res.json({ message: "OTP verified" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


//  Reset Password (After OTP Verification)

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await OTP.deleteOne({ email });

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
