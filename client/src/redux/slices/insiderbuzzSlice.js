const mongoose = require("mongoose");//But Mongoose automatically adds an _id field to every document unless you tell it not to.

const insiderBuzzSchema = new mongoose.Schema({ //schema
  label: String,  //label
  img: String,  //img
});

module.exports = mongoose.model("InsiderBuzz", insiderBuzzSchema);