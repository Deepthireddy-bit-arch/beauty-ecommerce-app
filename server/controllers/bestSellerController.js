const Product = require("../models/Product");


//  const getBestSellerProducts = async (req, res) => {
//   try {
//     const limit = Number(req.query.limit) || 20;
//     const sortBy = req.query.sortBy;

//     const sortOption = sortBy === 'bestSeller'
//       ? { isBestSeller: -1, createdAt: -1 }
//       : { createdAt: -1 };

//     const products = await Product.find({ isBestSeller: true, status: true })
//       .sort(sortOption)
//       .limit(limit);

//     res.status(200).json({ success: true, count: products.length, data: products });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
const getBestSellerProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;

    const products = await Product.find({
      isBestseller: true,  // ✅ matches DB
      active: true         // ✅ matches DB
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { getBestSellerProducts };