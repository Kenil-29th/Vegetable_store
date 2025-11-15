import express from "express";
import {
  createProduct,
  listProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getMyProducts
} from "../controllers/productController.js";
import { uploadSingle } from "../middlewares/uploadMiddleware.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", listProducts);

// Protected routes (require authentication)
router.get("/supplier/my-products", protect, authorizeRoles('supplier'), getMyProducts);
router.post("/", protect, uploadSingle, createProduct);
router.put("/:id", protect, uploadSingle, updateProduct);
router.delete("/:id", protect, authorizeRoles('supplier', 'admin'), deleteProduct);

// Public route (must be after specific routes to avoid conflicts)
router.get("/:id", getProduct);

export default router;
