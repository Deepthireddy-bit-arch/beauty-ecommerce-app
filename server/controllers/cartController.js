const Cart = require("../models/Cart");

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body; //need to pass in body
    const userId = req.user.id; //beare token in header

    let cart = await Cart.findOne({ user: userId }); //find the user's cart

    if (!cart) { //if no cart exists ,create a new one
      cart = await Cart.create({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(  //if its there then update the qunatity
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save(); 

    // ✅ Populate product details before sending
    cart = await Cart.findOne({ user: userId }).populate('items.product'); //popluate

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id,//headers 
    }).populate("items.product"); //why populate means without populate it will return only the product id if we use populate means the product details it will return

    res.status(200).json({
      success: true,
      cart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body; //body

    let cart = await Cart.findOne({ user: req.user.id }); //headers

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (item) {
      item.quantity = quantity;
    }

    await cart.save();

    // ✅ Populate product details before sending response
    cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user.id });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    // ✅ Populate product details AFTER removal
    cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeCartItem,
};