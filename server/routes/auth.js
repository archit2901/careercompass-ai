const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");

// Public routes (with rate limiting for security)
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

// Protected routes (require authentication)
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.put("/updateprofile", protect, updateProfile);
router.put("/updatepassword", protect, updatePassword);

module.exports = router;
