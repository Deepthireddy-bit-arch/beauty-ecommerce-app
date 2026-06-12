const Product = require("../models/Product");

exports.searchProducts = async (req, res) => {
  try {
    const {
      q = "",
      category,
      brand,
      minPrice,
      maxPrice,
      sort = "relevant",
      page = 1,
      limit = 12
    } = req.query;

    const pageNum = Math.max(1, parseInt(page)); //// Converts page to number and ensures page is at least 1
    const limitNum = Math.min(48, Math.max(1, parseInt(limit)));// Ensures limit is between 1 and 48
// 48 is the maximum number of products allowed per request
    const skip = (pageNum - 1) * limitNum; //1*48 =48
    // Number of records to skip for pagination

// Example:
// page=1, limit=12 => skip=0
// page=2, limit=12 => skip=12
// page=3, limit=12 => skip=24

    const filter = {};//allproducts

    if (q.trim()) { //case sensitive purpose
      filter.$or = [ //any one match means it will give based on name,desc,brand and categoty
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } }
      ];
    }

    if (category && category !== "all") { //all categorys
      filter.category = { $regex: category, $options: "i" };
    }

    if (brand && brand !== "all") {
      filter.brand = { $regex: brand, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice); //500>=500
      if (maxPrice) filter.price.$lte = Number(maxPrice); //200<=200
    }

    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limitNum), //filters products,limit,what na all skipped only gilted it willr etun
      Product.countDocuments(filter)
    ]);

    res.json({
      success: true,
      products,
      total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.searchSuggestions = async (req, res) => {
  try {
    const { q = "" } = req.query; //in query 

    const products = await Product.find({ 
      name: { $regex: q, $options: "i" } //based on serached with case sensitive also we are returning the 5 of names 
    })
      .select("name")
      .limit(5);

    res.json({
      success: true,
      suggestions: products
    });
  } catch (error) {
    res.status(500).json({
      success: false
    });
  }
};