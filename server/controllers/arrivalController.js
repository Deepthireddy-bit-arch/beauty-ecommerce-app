const NewArrival = require('../models/newArrivals');

// Create
const createNewArrival = async (req, res) => {
  try {
    const data = await NewArrival.create(req.body);

    res.status(201).json({
      success: true,
      message: 'New Arrival created successfully',
      result: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All
const getNewArrivals = async (req, res) => {
  try {
    const data = await NewArrival.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      result: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Single
const getNewArrivalById = async (req, res) => {
  try {
    const data = await NewArrival.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'New Arrival not found'
      });
    }

    res.status(200).json({
      success: true,
      result: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update
const updateNewArrival = async (req, res) => {
  try {
    const data = await NewArrival.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Updated successfully',
      result: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete
const deleteNewArrival = async (req, res) => {
  try {
    await NewArrival.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createNewArrival,
  getNewArrivals,
  getNewArrivalById,
  updateNewArrival,
  deleteNewArrival
};