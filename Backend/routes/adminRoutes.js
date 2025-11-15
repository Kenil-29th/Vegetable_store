import express from "express";
import {
  getAllSuppliers,
  getAllCustomers,
  getAllProducts,
  getProductsBySupplier,
  toggleUserStatus,
  toggleProductStatus
} from "../controllers/adminController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Require authentication and allow 'admin' role for admin access
router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/suppliers', getAllSuppliers);
router.get('/customers', getAllCustomers);
router.get('/products', getAllProducts);
router.get('/suppliers/:supplierId/products', getProductsBySupplier);

router.patch('/users/:userId/status', toggleUserStatus); // body: { status: true/false }
router.patch('/products/:productId/status', toggleProductStatus); // body: { isActive: true/false }

export default router;
