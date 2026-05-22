const User = require("../models/User");

const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: req.user 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id); //headers 

    if (!user) { //if user not found
      return res.status(404).json({
        message: "User not found"
      });
    }

    // update fields 
    user.name = req.body.name || user.name; //name need to send in body
    user.email = req.body.email || user.email; //email

    // save updated user
    const updatedUser = await user.save();//save

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


module.exports = {
  getProfile,updateProfile
};