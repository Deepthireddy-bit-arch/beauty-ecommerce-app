const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { //which user placed the order
      type: mongoose.Schema.Types.ObjectId, //user id is represented as an ObjectId
      ref: "User", //connects to the user model to get the user details from the user id
      required: true, //not as empty
    },

    orderItems: [ //multiple orders
      {
        product: { //product id
          type: mongoose.Schema.Types.ObjectId, 
          ref: "Product",
          required: true,
        },
        name: String, //name
        qty: Number, //quantity
        price: Number, //price
        image: String, //image url
      },
    ],

    shippingAddress: { //address details
      address: String,  //addressline
      city: String,
      state: String,
      pincode: String,
      phone: String,
    },

    paymentMethod: {
      type: String,
      default: "COD", //cash on delivery
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    isPaid: {
      type: Boolean,
      default: false, //not paid
    },

    paidAt: Date,

    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], //allowed values for order status
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);