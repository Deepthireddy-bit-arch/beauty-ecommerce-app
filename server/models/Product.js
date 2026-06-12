const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
    },

    // ── ADD THIS: links product to a Brand document ──
    brandId: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    originalPrice: {
      type: Number,
    },

    // ── ADD THIS: discount percentage ──
    discount: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },

    // ── ADD THIS: number of reviews ──
    reviews: {
      type: Number,
      default: 0,
    },

    // ── ADD THIS: number of shades/variants ──
    shades: {
      type: Number,
      default: 1,
    },

    images: [
      {
        type: String,
      },
    ],

    // ── ADD THIS: short label like "Most Reordered" ──
    tag: {
      type: String,
      default: "",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    // ── ADD THIS: for bestseller badge ──
    isBestseller: {
      type: Boolean,
      default: false,
    },

    // ── ADD THIS: for active/inactive toggle ──
    active: {
      type: Boolean,
      default: true,
    },

    // ── ADD THIS: for manual sort order ──
    order: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },

    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      default: null,
    },

    stock: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);