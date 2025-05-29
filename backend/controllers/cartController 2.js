import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let itemId = req.body.itemId;

    if (!itemId || typeof itemId !== "string" || !itemId.trim()) {
      return res.status(400).json({ success: false, message: "Missing or invalid itemId" });
    }
    itemId = itemId.trim();

    const userData = await userModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    const cartData = userData.cartData || new Map();

    const currentQty = cartData.get(itemId) || 0;
    cartData.set(itemId, currentQty + 1);

    // Save updated cartData (convert Map to plain object for update)
    await userModel.findByIdAndUpdate(userId, { cartData: Object.fromEntries(cartData) }, { new: true });

    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let itemId = req.body.itemId;

    if (!itemId || typeof itemId !== "string" || !itemId.trim()) {
      return res.status(400).json({ success: false, message: "Missing or invalid itemId" });
    }
    itemId = itemId.trim();

    const userData = await userModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    const cartData = userData.cartData || new Map();

    if (!cartData.has(itemId)) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    const currentQty = cartData.get(itemId) - 1;

    if (currentQty <= 0) {
      cartData.delete(itemId);
    } else {
      cartData.set(itemId, currentQty);
    }

    await userModel.findByIdAndUpdate(userId, { cartData: Object.fromEntries(cartData) }, { new: true });

    res.json({ success: true, message: "Removed from Cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // cartData is a Map, convert to plain object for response
    const cartDataObj = userData.cartData ? Object.fromEntries(userData.cartData) : {};

    res.status(200).json({ success: true, cartData: cartDataObj });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { addToCart, removeFromCart, getCart };