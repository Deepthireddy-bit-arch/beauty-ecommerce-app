const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  title:  { type: String, required: true },
  sub:    { type: String },
  offer:  { type: String },
  image:  { type: String },
  type:   { type: String, default: "brand" },
  active: { type: Boolean, default: true },
  order:  { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Banner", bannerSchema);