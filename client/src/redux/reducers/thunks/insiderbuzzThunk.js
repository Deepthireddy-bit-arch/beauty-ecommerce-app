const InsiderBuzz = require("../models/InsiderBuzz");
const Product = require("../models/Product");

exports.getHomeData = async (req, res) => {
  try {
    const insiderBuzz = await insiderbuzzSlice.find(); 

    const categories = await Product.aggregate([ 
      {
        $group: {   
          _id: "$category",    
          img: {
            $first: { $arrayElemAt: ["$images", 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          img: 1
        }
      }
    ]);

    res.json({
      success: true,
      insiderBuzz,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};