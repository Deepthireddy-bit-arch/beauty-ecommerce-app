const mongoose = require("mongoose");

const insiderBuzzSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("InsiderBuzz", insiderBuzzSchema);