const Brand   = require("../models/Brand");
const Product = require("../models/Product");

const createBrand = async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    return res.status(201).json({ success: true, data: brand });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ active: true }).sort({ order: 1 });
    return res.status(200).json({ success: true, data: brands });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getBrandsWithCount = async (req, res) => {
  try {
    const brands = await Brand.find({ active: true }).sort({ order: 1 }).lean();
    const brandsWithCount = await Promise.all(
      brands.map(async (b) => ({
        ...b,
        count: await Product.countDocuments({
          brandId: b._id.toString(),
          active: true,
        }),
      }))
    );
    return res.status(200).json({ success: true, data: brandsWithCount });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!brand) return res.status(404).json({ success: false, message: "Brand not found" });
    return res.status(200).json({ success: true, data: brand });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return res.status(404).json({ success: false, message: "Brand not found" });
    return res.status(200).json({ success: true, message: "Brand deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createBrand, getBrands, getBrandsWithCount, updateBrand, deleteBrand };