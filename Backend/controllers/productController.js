import Product from "../models/productModel.js";
import { deleteFile } from "../utils/deleteFile.js";
import path from "path";

// Create product (with optional image upload middleware before)
export const createProduct = async (req, res) => {
  try {
    const { name, quantity, price, description, isActive, category, sku } = req.body;
    const productData = { name, quantity, price, description, isActive, category, sku, supplier: req.user._id };
    if (req.file) {
      // store relative path for serving
      productData.image = path.join("uploads", "products", req.file.filename).replace(/\\/g, "/");
    }
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Create failed", error: err.message });
  }
};

export const listProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

    const updates = req.body;
    if (req.file) {
      // delete old image
      if (product.image) await deleteFile(product.image);
      updates.image = path.join("uploads", "products", req.file.filename).replace(/\\/g, "/");
    }

    Object.assign(product, updates);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

    // Allow admins to delete any product
    if (req.user.role === 'admin') {
      if (product.image) await deleteFile(product.image);
      await product.deleteOne();
      return res.json({ message: "Deleted" });
    }

    // Suppliers can only delete their own products
    if (!product.supplier) {
      return res.status(403).json({ message: "Access denied: Product has no supplier assigned" });
    }

    if (product.supplier.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied: You can only delete your own products" });
    }

    if (product.image) await deleteFile(product.image);
    await product.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};
