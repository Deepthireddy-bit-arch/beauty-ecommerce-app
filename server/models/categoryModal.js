const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { //name
    type: String,
    required: true
  }, //discount
  discount: {
    type: String,
    required: true
  },
  img: { //img
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Category", categorySchema);