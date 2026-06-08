const Product = require("../models/Product");

// GET /deals
const getDeals = async (req, res) => {
  try {
    const products = await Product.find(); //find the products from mongodb which will filter the deals 

    const deals = products 
      .filter(p => p.originalPrice && p.price < p.originalPrice) //originalPrice and exists price is less than originalPrice
      .map(p => ({ //Instead of sending full product object, you send only needed fields
        _id: p._id,
        name: p.name,
        brand: p.brand,
        image: p.images?.[0],
        price: p.price,
        originalPrice: p.originalPrice,
        discount: Math.round( //Get discount percentage
          ((p.originalPrice - p.price) / p.originalPrice) * 100
        ),
        category: p.category
      }));

    res.json({
      success: true,
      count: deals.length,
      deals
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching deals",
      error: error.message
    });
  }
};

module.exports = { getDeals };