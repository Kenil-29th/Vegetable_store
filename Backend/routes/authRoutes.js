import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Verify Token Route
router.get("/verify", protect, (req, res) => {
  res.json({ 
    success: true, 
    user: { 
      id: req.user._id, 
      email: req.user.email, 
      role: req.user.role, 
      name: req.user.name 
    } 
  });
});

// Test Protected Route
router.get("/profile", protect, (req, res) => {
  res.json({ message: "Profile accessed successfully", user: req.user });
});

export default router;
