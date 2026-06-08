const CategoryBanner = require("../models/CategoryBanner");

// GET all banners
const getCategoryBanners = async (req, res) => {
  try {
    const banners = await CategoryBanner.find({ active: true }).sort({ order: 1 }); //find in ascending order which are active

    res.json({
      success: true,
      count: banners.length,
      data: banners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category banners",
      error: error.message
    });
  }
};

// CREATE banner (admin use)
const createCategoryBanner = async (req, res) => {
  try {
    const banner = await CategoryBanner.create(req.body);//create

    res.status(201).json({
      success: true,
      message: "Banner created",
      data: banner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create banner",
      error: error.message
    });
  }
};
const deleteCategoryBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await CategoryBanner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found"
      });
    }

    await CategoryBanner.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Category banner deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting banner",
      error: error.message
    });
  }
};
module.exports = {
  getCategoryBanners,
  createCategoryBanner,
  deleteCategoryBanner
};