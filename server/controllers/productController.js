const Product = require("../models/Product");

// ADD PRODUCT — unchanged
const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL PRODUCTS — updated with brand page filters
const getProducts = async (req, res) => {
  try {
    const page       = parseInt(req.query.page)  || 1;
    const limit      = parseInt(req.query.limit) || 10;
    const search     = req.query.search    || "";
    const sortField  = req.query.sort      || "createdAt";
    const order      = req.query.order === "asc" ? 1 : -1;

    // ── Brand page filter params ──────────────────────────────
    const { brands, categories, priceRanges, discounts, sortBy } = req.query;

    const skip = (page - 1) * limit;
    const filter = { active: true };

    // Existing search filter
    if (search) {
      filter.$or = [
        { name:  { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    // ── Brand filter ──────────────────────────────────────────
    // FIXED: was querying `brandId` (ObjectId) which never matched because
    // product.brandId values were seeded with wrong IDs.
    // Products store brand as a plain string in the `brand` field ("Maybelline"),
    // so we query that directly. Frontend now sends brand names, not _ids.
    if (brands) {
      const brandNames = brands.split(",").filter(Boolean);
      if (brandNames.length) {
        filter.brand = {
          $in: brandNames.map((name) => new RegExp(`^${name}$`, "i")), // case-insensitive exact match
        };
      }
    }

    // ── Category filter ───────────────────────────────────────
    if (categories) {
      const cats = categories.split(",").filter(Boolean);
      if (cats.length) filter.category = { $in: cats };
    }

    // ── Price range filter ────────────────────────────────────
    if (priceRanges) {
      const ranges = priceRanges.split(",").filter(Boolean);
      if (ranges.length) {
        const priceConditions = ranges.map((r) => {
          const [min, max] = r.split("-").map(Number);
          return { price: { $gte: min, $lte: max } };
        });
        // merge with existing $or if search is active
        if (filter.$or) {
          filter.$and = [
            { $or: filter.$or },
            { $or: priceConditions },
          ];
          delete filter.$or;
        } else {
          filter.$or = priceConditions;
        }
      }
    }

    // ── Discount filter ───────────────────────────────────────
    if (discounts) {
      const vals = discounts.split(",").map(Number).filter(Boolean);
      if (vals.length) filter.discount = { $gte: Math.min(...vals) };
    }

    // ── Sort: brand page sortBy overrides admin sort/order ────
    let sortOption = { [sortField]: order }; // default admin sort
    if (sortBy) {
      switch (sortBy) {
        case "price-low":  sortOption = { price: 1 };        break;
        case "price-high": sortOption = { price: -1 };       break;
        case "rating":     sortOption = { rating: -1 };      break;
        case "discount":   sortOption = { discount: -1 };    break;
        case "featured":   sortOption = { isFeatured: -1, order: 1, createdAt: -1 }; break;
      }
    }

    console.log("req.query:", req.query);
    console.log("filter:", JSON.stringify(filter, null, 2));

    const total    = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count:         products.length,
      totalProducts: total,
      totalPages:    Math.ceil(total / limit),
      currentPage:   page,
      products,
      // ── brand page uses these keys ──
      data:       products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE PRODUCT — unchanged
const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE PRODUCT — unchanged
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE PRODUCT — unchanged
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    await product.deleteOne();
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const activateAllProducts = async (req, res) => {
  try {
    const result = await Product.updateMany({}, { $set: { active: true } });
    res.status(200).json({
      success: true,
      message: `Activated ${result.modifiedCount} products`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  activateAllProducts,
};