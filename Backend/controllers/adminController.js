import User from "../models/userModel.js";
import Product from "../models/productModel.js";

// Get all suppliers
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await User.find({ role: 'supplier' }).select('-password');
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch suppliers', error: err.message });
  }
};

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'user' }).select('-password');
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch customers', error: err.message });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('supplier', 'name email');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
};

// Get products for a supplier (supplierId param)
export const getProductsBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const products = await Product.find({ supplier: supplierId }).populate('supplier', 'name email');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch supplier products', error: err.message });
  }
};

// Toggle user (supplier/customer) active status
export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body; // expected boolean
    if (typeof status !== 'boolean') return res.status(400).json({ message: 'status (boolean) is required in body' });
    const user = await User.findByIdAndUpdate(userId, { status }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user status', error: err.message });
  }
};

// Toggle product active status
export const toggleProductStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const { isActive } = req.body; // expected boolean
    if (typeof isActive !== 'boolean') return res.status(400).json({ message: 'isActive (boolean) is required in body' });
    const product = await Product.findByIdAndUpdate(productId, { isActive }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product status', error: err.message });
  }
};
