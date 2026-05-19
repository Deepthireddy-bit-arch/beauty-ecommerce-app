const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({ //ONE product inside cart {schema for one product}
  product: {
    type: mongoose.Schema.Types.ObjectId, //stores product id
    ref: "Product", //connects to the product
    required: true, //cannot be empty
  },

  quantity: {
    type: Number,
    required: true,
    default: 1, //default =1 if not provided 
  },
});

const cartSchema = new mongoose.Schema( //{schema for whole cart}
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, //{stored the id,which user owns this cart}
      ref: "User",
      required: true,
    },

    items: [cartItemSchema], //Cart contains multiple items
  },
  { timestamps: true } //automatically adds createdat and updated at
);

module.exports = mongoose.model("Cart", cartSchema);