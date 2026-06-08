const Product = require("../models/Product");
const InsiderBuzz = require("../models/InsiderBuzz");

exports.getHomeData = async (req, res) => {
  try {
    const insiderBuzz = await InsiderBuzz.find(); //reads buzzs collection

    const categories = await Product.aggregate([ //group them by categories[products]
      {
        $group: {
          _id: "$category",// // Group all products by category
          img: {
            $first: { $arrayElemAt: ["$images", 0] }//   // Take the first image from the first product in each category
          }
        }
      },
      {
        $project: {
          _id: 0,// Hide _id field
          name: "$_id",// // Rename category (_id) to name
          img: 1// // Include image field in response
        }
      }
    ]);

    res.status(200).json({
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
exports.createInsiderBuzz = async (req, res) => {
  try {
    const buzz = await InsiderBuzz.create({ //create the buzz
      label: req.body.label, //label and img in body
      img: req.body.img,
    });

    res.status(201).json({
      success: true,
      data: buzz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.deleteInsiderBuzz = async (req, res) => {
  try {
    const buzz = await InsiderBuzz.findByIdAndDelete(req.params.id);

    if (!buzz) {
      return res.status(404).json({
        success: false,
        message: "Buzz not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Buzz deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};