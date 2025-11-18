import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "mySecretKey";

// Generate a JWT token
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
    },
    SECRET_KEY,
    { expiresIn: "7d" } // token valid for 7 days
  );
};

// Verify a JWT token
export const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};
