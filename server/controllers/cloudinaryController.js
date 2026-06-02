const uploadToCloudinary = require("../utils/uploadToCloudinary");
const Product = require("../models/Product");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file received",
      });
    }

    // 🔥 Cloudinary upload (REUSABLE)
    const result = await uploadToCloudinary(
      req.file.buffer,
      "beauty"
    );

    // 🔥 Save to DB
    const newProduct = await Product.create({
      name: req.body.name,
      brand: req.body.brand,
      description: req.body.description,
      price: req.body.price,
      originalPrice: req.body.originalPrice,
      category: req.body.category,
      stock: req.body.stock,

      images: [result.secure_url],
    });

    res.json({
      success: true,
      product: newProduct,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  uploadImage,
};