const Product = require("../models/Product");


// ADD PRODUCT
const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);//saves product in db

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    // QUERY PARAMS
    const page = parseInt(req.query.page) || 1; //current page
    const limit = parseInt(req.query.limit) || 10; //number of products per page
    const search = req.query.search || ""; //search term for name or brand
    const sortField = req.query.sort || "createdAt"; //what to sort
    const order = req.query.order === "asc" ? 1 : -1; //how to sort like asc or desc

    const skip = (page - 1) * limit; //logic for pagination to skip previous data
   

    // SEARCH FILTER
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } }, //name
            { brand: { $regex: search, $options: "i" } }, //brand
          ],
        }
      : {};

    // GET PRODUCTS WITH ALL FEATURES
    const products = await Product.find(filter)
      .sort({ [sortField]: order })
      .skip(skip)
      .limit(limit);

    // TOTAL COUNT (for pagination UI)
    const total = await Product.countDocuments(filter); 

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE PRODUCT
const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);//Finds product using ID from URL

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};