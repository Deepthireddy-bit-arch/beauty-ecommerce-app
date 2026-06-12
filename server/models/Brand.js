// models/Brand.js

const mongoose = require("mongoose");

// const brandSchema = new mongoose.Schema(
//   {
//     name: { //name of the brand icludes type,required and unique
//       type: String,
//       required: true,
//       unique: true,
//     },

//     logo: { //logo of the brand includes type and default value
//       type: String,
//       default: "",
//     },
//     sub: {
//       type: String,
//       default: "",
//     },

//     active: { //active status of the brand includes type and default value
//       type: Boolean,
//       default: true,
//     },

//     order: { //order of the brand 
//       type: Number,
//       default: 0,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );
const brandSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  logo:          { type: String, default: "" },
  coverImage:    { type: String, default: "" },
  tagline:       { type: String, default: "" },
  description:   { type: String, default: "" },
  story:         { type: String, default: "" },  // ← right column of brand story
  storyTitle:    { type: String, default: "" },  // ← the big italic quote
  country:       { type: String, default: "" },
  founded:       { type: String, default: "" },
  isCrueltyFree: { type: Boolean, default: false },
  active:        { type: Boolean, default: true },
  order:         { type: Number,  default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Brand", brandSchema);