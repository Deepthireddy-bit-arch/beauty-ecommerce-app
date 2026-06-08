const Collection = require("../models/Collections");

const createCollection = async (req, res) => {
  try {
    const data = await Collection.create(req.body);

    res.json({
      success: true,
      message: "Collection created",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ isActive: true }).sort({
      order: 1,
    });

    res.json({
      success: true,
      data: collections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;

    await Collection.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Collection deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createCollection,
  getCollections,
  deleteCollection
};