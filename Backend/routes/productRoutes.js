import express from "express";
import {
  createProduct,
  listProducts,
  getProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import { uploadSingle } from "../middlewares/uploadMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", listProducts);
router.get("/:id", getProduct);

// Protected routes (require authentication)
router.use(protect);
router.post("/", uploadSingle, createProduct);
router.put("/:id", uploadSingle, updateProduct);
router.delete("/:id", deleteProduct);

export default router;
