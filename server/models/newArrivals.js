const mongoose = require('mongoose');

const newArrivalSchema = new mongoose.Schema(
  {
    title: { //title
      type: String,
      required: true
    },
    description: {
      type: String
    },
    image: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('NewArrival', newArrivalSchema);