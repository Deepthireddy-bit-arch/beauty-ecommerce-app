const Order = require("../models/Order");


const createOrder = async (req, res) => {
  try {
    console.log("🔥 REQUEST BODY:", req.body);
    console.log("🔥 USER:", req.user);

    const {
      orderItems,
      shippingAddress,
      totalPrice,
      paymentMethod,
    } = req.body;

    // check order items
    if (!orderItems || orderItems.length === 0) {
      console.log("❌ No order items received");
      return res.status(400).json({ message: "No order items" });
    }

    // check user from middleware
    if (!req.user) {
      console.log("❌ No user in request (auth failed)");
      return res.status(401).json({ message: "User not authenticated" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalPrice,
      paymentMethod,
    });

    console.log("🔥 ORDER BEFORE SAVE:", order);

   const savedOrder = await order.save();

    console.log("✅ ORDER SAVED:", savedOrder);

    res.status(201).json(savedOrder);
  } catch (error) {
    console.log("❌ CREATE ORDER ERROR:", error.message);
    console.log(error);

    res.status(500).json({
      message: "Server error while creating order",
      error: error.message,
    });
  }
};
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ //sort the orders by date in descending order
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate( //need to pass the order id in url and get the order details along with the user details
      "user", //
      "name email" //
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id); //need to pass the order id

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = req.body.status || order.orderStatus;

    if (req.body.status === "Delivered") { //in body need to p[ass the status
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    const updated = await order.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById,updateOrderStatus };