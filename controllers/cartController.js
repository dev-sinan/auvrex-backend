import Cart from "../models/cartModel.js";

// 🟢 Get all cart items
export const getCartItems = async (req, res) => {
  try {
    const cart = await Cart.find();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Add or increase quantity
export const addOrUpdateCartItem = async (req, res) => {
  try {
    const { id, name, price, img, size, quantity } = req.body;

    let item = await Cart.findOne({ id, size });

    if (item) {
      // item already exists → increment quantity
      item.quantity += quantity || 1;
      await item.save();
    } else {
      // new item → create one
      item = new Cart({ id, name, price, img, size, quantity: quantity || 1 });
      await item.save();
    }

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding item" });
  }
};

// 🟡 Decrease quantity (NEW)
export const decreaseCartItem = async (req, res) => {
  try {
    const { id, size } = req.body;
    const item = await Cart.findOne({ id, size });

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.quantity > 1) {
      item.quantity -= 1;
      await item.save();
      res.json(item);
    } else {
      await Cart.deleteOne({ id, size });
      res.json({ message: "Item removed" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error decreasing item" });
  }
};

// 🟡 Update quantity (direct)
export const updateCartItem = async (req, res) => {
  try {
    const { id, size, quantity } = req.body;
    const updatedItem = await Cart.findOneAndUpdate(
      { id, size },
      { quantity },
      { new: true }
    );

    if (!updatedItem)
      return res.status(404).json({ message: "Item not found" });

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: "Error updating item" });
  }
};

// 🔴 Remove item
export const deleteCartItem = async (req, res) => {
  try {
    const { id, size } = req.body;
    await Cart.deleteOne({ id, size });
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting item" });
  }
};

// 🔴 Clear all items
export const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany();
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Error clearing cart" });
  }
};
