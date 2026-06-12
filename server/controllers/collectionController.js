const Collections = require("../models/Collections");
const Product = require("../models/Product");

const createCollection = async (req, res) => {
  try {
    const data = await Collections.create(req.body);
    res.json({ success: true, message: "Collection created", data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCollections = async (req, res) => {
  try {
    const { categories, minPrice, maxPrice, minRating, inStock, onSale, sortBy } = req.query;
    const filter = { isActive: true };

    if (categories) filter.category = { $in: categories.split(",") };
    if (minRating)  filter.rating   = { $gte: Number(minRating) };
    if (inStock === "true") filter.inStock = true;
    if (onSale  === "true") filter.onSale  = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let query = Collections.find(filter);
    switch (sortBy) {
      case "price-asc":  query = query.sort({ price:  1 });           break;
      case "price-desc": query = query.sort({ price: -1 });           break;
      case "rating":     query = query.sort({ rating: -1 });          break;
      case "newest":     query = query.sort({ createdAt: -1 });       break;
      default:           query = query.sort({ order: 1, createdAt: -1 });
    }

    const collections = await query;
    res.status(200).json({ success: true, collections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCollectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      category,
      sortBy = "featured",
      page   = 1,
      limit  = 9,
      minPrice,
      maxPrice,
    } = req.query;

    const collection = await Collections.findById(id);
    if (!collection) {
      return res.status(404).json({ success: false, message: "Collection not found" });
    }

    // Build product filter — products linked by collection._id OR by collection title string
    const productFilter = {
  active: true,
  $or: [
    { collectionId: collection._id },
    { collectionId: collection._id.toString() },
    { collection: collection._id },
    { collectionName: { $regex: new RegExp(`^${collection.title}$`, "i") } },
  ],
};

    if (category && category !== "all") {
      productFilter.category = { $regex: new RegExp(category, "i") };
    }
    if (minPrice || maxPrice) {
      productFilter.price = {};
      if (minPrice) productFilter.price.$gte = Number(minPrice);
      if (maxPrice) productFilter.price.$lte = Number(maxPrice);
    }

    const sortMap = {
      featured:    { isFeatured: -1, order: 1, createdAt: -1 },
      newest:      { createdAt: -1 },
      "price-low":  { price: 1 },
      "price-high": { price: -1 },
      rating:      { rating: -1 },
      discount:    { discount: -1 },
    };

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));

    const [products, total] = await Promise.all([
      Product.find(productFilter)
        .sort(sortMap[sortBy] || sortMap.featured)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Product.countDocuments(productFilter),
    ]);

    res.status(200).json({
      success: true,
      collection,
      products,
      pagination: {
        total,
        page:  pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCollection = async (req, res) => {
  try {
    await Collections.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Collection deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createCollection, getCollections, getCollectionById, deleteCollection };