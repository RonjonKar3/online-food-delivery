import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Place Order Controller
const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId; // from verifyToken middleware

    if (!items || !amount || !address) {
      return res.json({ success: false, message: "Missing order details." });
    }

    // Create new order with COD payment
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      paymentMethod: "cod",
      paymentStatus: "unpaid",
      status: "Food Processing",
    });

    // Save to DB
    await newOrder.save();

    // Clear user cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Return success
    res.json({
      success: true,
      orderId: newOrder._id,
      message: "Order placed successfully with Cash on Delivery.",
    });
  } catch (error) {
    console.error("Order Placement Error:", error);
    res.json({ success: false, message: "Server error placing order." });
  }
};

// User Orders Controller
const userOrders = async (req, res) => {
  try {
    const userId = req.userId; // from verifyToken middleware
    const orders = await orderModel.find({ userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching orders." });
  }
};

// List all orders (Admin only)
const listOrders = async (req, res) => {
  try {
    console.log("Admin ID (from token):", req.userId);
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error listing orders:", error);
    res.status(500).json({ success: false, message: "Server error fetching orders." });
  }
};


//api for updating order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {status:req.body.status});
    res.json({success:true, message:"Status updated"})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}

export { placeOrder, userOrders, listOrders, updateStatus};
