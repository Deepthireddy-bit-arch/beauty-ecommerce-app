// models/Brand.js

const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: { //name of the brand icludes type,required and unique
      type: String,
      required: true,
      unique: true,
    },

    logo: { //logo of the brand includes type and default value
      type: String,
      default: "",
    },
    sub: {
      type: String,
      default: "",
    },

    active: { //active status of the brand includes type and default value
      type: Boolean,
      default: true,
    },

    order: { //order of the brand 
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Brand", brandSchema);