const Product = require("../models/Product");

const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category"); //unique

    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { getCategories };