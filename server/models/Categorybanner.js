const mongoose = require("mongoose");

const categoryBannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },        // Skincare, Makeup
    offer: { type: String, required: true },        // Save ₹2000
    sub: { type: String },                          // subtitle text
    img: { type: String, required: true },         // banner image URL
    accent: { type: String, default: "#7c3aed" },  // color
    category: { type: String, required: true },    // skincare, makeup, nails
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CategoryBanner", categoryBannerSchema);