const Banner = require("../models/Banner");

const getBanners = async (req, res) => {
  try {
    const { type } = req.query; //what we filterdtype theat it will return
    const query = { active: true }; //filters that will send to the monfo db //give alla the banners which are active
    if (type) query.type = type; //query.type ,query is just an object 

    const banners = await Banner.find(query).sort({ order: 1 });
    return res.status(200).json({ success: true, data: banners });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    return res.status(201).json({ success: true, data: banner });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return res.status(404).json({ success: false, message: "Banner not found" });
    return res.status(200).json({ success: true, data: banner });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: "Banner not found" });
    return res.status(200).json({ success: true, message: "Banner deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getBanners, createBanner, updateBanner, deleteBanner };