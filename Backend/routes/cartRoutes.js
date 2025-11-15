import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  checkoutCart
} from "../controllers/cartController.js";

const router = express.Router();

// All cart routes require authentication
router.use(protect);

// Get user's cart
router.get("/", getCart);

// Add item to cart
router.post("/items", addToCart);

// Update item quantity
router.put("/items/:itemId", updateCartItem);

// Remove item from cart
router.delete("/items/:itemId", removeCartItem);

// Clear cart
router.delete("/", clearCart);

// Checkout cart
router.post("/checkout", checkoutCart);

export default router;
