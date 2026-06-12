const Brand = require("../models/Brand");
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
const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, sortBy = "featured", page = 1, limit = 9 } = req.query;

    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ success: false, message: "Brand not found" });
    }

    // Products are linked by brand NAME string, not brandId
    const filter = { active: true, brand: new RegExp(`^${brand.name}$`, "i") };

    if (category && category !== "all") {
      filter.category = { $regex: new RegExp(category, "i") };
    }

    const sortMap = {
      featured: { isFeatured: -1, order: 1, createdAt: -1 },
      newest: { createdAt: -1 },
      "price-low": { price: 1 },
      "price-high": { price: -1 },
      rating: { rating: -1 },
    };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortMap[sortBy] || sortMap.featured)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      brand,
      products,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
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
        // FIX: match by brand name string, not brandId
        count: await Product.countDocuments({
          brand: new RegExp(`^${b.name}$`, "i"),
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

module.exports = { createBrand, getBrands, getBrandsWithCount, getBrandById, updateBrand, deleteBrand };