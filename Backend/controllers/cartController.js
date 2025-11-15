import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// Get user's cart (create if doesn't exist)
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name image price');
    
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: []
      });
    }
    
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart", error: err.message });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // Validate product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (!product.isActive) {
      return res.status(400).json({ message: "Product is not available" });
    }
    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: []
      });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(item => 
      item.product.toString() === productId
    );

    if (existingItem) {
      // Update quantity if exists
      existingItem.quantity += quantity;
      existingItem.price = product.price; // Update price in case it changed
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }

    await cart.save();
    
    // Return populated cart
    cart = await Cart.findById(cart._id)
      .populate('items.product', 'name image price');
    
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to add to cart", error: err.message });
  }
};

// Update item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Check stock
    const product = await Product.findById(item.product);
    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    item.quantity = quantity;
    item.price = product.price; // Update price in case it changed
    
    await cart.save();
    
    // Return populated cart
    const updatedCart = await Cart.findById(cart._id)
      .populate('items.product', 'name image price');
    
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: "Failed to update cart", error: err.message });
  }
};

// Remove item from cart
export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();
    
    // Return populated cart
    const updatedCart = await Cart.findById(cart._id)
      .populate('items.product', 'name image price');
    
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item", error: err.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to clear cart", error: err.message });
  }
};

// Checkout cart - reduce product quantities and clear cart
export const checkoutCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Reduce product quantities
    for (const item of cart.items) {
      const product = item.product;
      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      product.quantity -= item.quantity;
      await product.save();
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.json({ message: "Order placed successfully", total: cart.total });
  } catch (err) {
    res.status(500).json({ message: "Checkout failed", error: err.message });
  }
};
