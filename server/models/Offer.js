const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    couponCode: {
      type: String,
      required: true
    },
    discountPercentage: {
      type: Number,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Offer", offerSchema);