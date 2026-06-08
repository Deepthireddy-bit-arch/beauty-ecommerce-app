const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    offer: {
      type: String,
    },

    sub: {
      type: String,
    },

    image: {
      type: String,
      required: true,
    },

    category: {
      type: String, // optional filter (skincare, makeup etc.)
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collection", collectionSchema);