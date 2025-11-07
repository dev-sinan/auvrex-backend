import Cart from "../models/cartModel.js";

// 🟢 Get all cart items
export const getCartItems = async (req, res) => {
  try {
    const cart = await Cart.find();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add or update cart item
export const addOrUpdateCartItem = async (req, res) => {
  try {
    const { id, name, price, img, size, quantity } = req.body;

    let item = await Cart.findOne({ id, size });

    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = new Cart({ id, name, price, img, size, quantity });
      await item.save();
    }

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Error adding item" });
  }
};

//  Update quantity
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const updatedItem = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: "Error updating item" });
  }
};

//  Remove item
export const deleteCartItem = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting item" });
  }
};

//  Clear all items
export const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany();
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Error clearing cart" });
  }
};
