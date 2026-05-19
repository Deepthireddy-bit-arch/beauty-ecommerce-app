const Wishlist = require("../models/Wishlist");

// GET WISHLIST
exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }) //headers
      .populate("items.product");

    if (!wishlist) { //if not create empty wislist
      wishlist = await Wishlist.create({
        user: req.user.id,
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ADD TO WISHLIST
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body; //body pass the product is

    let wishlist = await Wishlist.findOne({ user: req.user.id });  //headers{frontend}}

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        items: [],
      });
    }

    const alreadyExists = wishlist.items.find(
      (item) => item.product.toString() === productId
    );

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    wishlist.items.push({ product: productId });

    await wishlist.save();

    const updated = await Wishlist.findOne({ user: req.user.id })
      .populate("items.product");

    res.status(200).json({
      success: true,
      wishlist: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// REMOVE FROM WISHLIST
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params; 

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId
    );

    await wishlist.save();

    const updated = await Wishlist.findOne({ user: req.user.id })
      .populate("items.product");

    res.status(200).json({
      success: true,
      wishlist: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};