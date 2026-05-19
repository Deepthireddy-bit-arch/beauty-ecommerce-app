const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, //user wishlist belongs to
      ref: "User", //concets to the user model
      required: true, //cannot be empty
      unique: true, //one wishlist per user
    },

    items: [ //mutiple items
      {
        product: {
          type: mongoose.Schema.Types.ObjectId, //id
          ref: "Product", //connects to the product model
          required: true, //cannot be empty
        },

        addedAt: {
          type: Date,//when was the product added
          default: Date.now, //default to current date
        },
      },
    ],
  },
  { timestamps: true }///timestamaos automaticaltically adds
);

module.exports = mongoose.model("Wishlist", wishlistSchema);