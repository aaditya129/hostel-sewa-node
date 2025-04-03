const AdImage = require("../models/AdImage");
const cloudinary = require('../config/cloudinary');

const uploadAdImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ msg: "Image file is required" });

    let ad = await AdImage.findOne();

    // If image already exists, delete old one from Cloudinary
    if (ad && ad.publicId) {
      await cloudinary.uploader.destroy(ad.publicId);
    }

    // Save new one
    const newAd = {
      imageUrl: file.path,
      publicId: file.filename, // Cloudinary gives this as filename
    };

    if (ad) {
      ad.imageUrl = newAd.imageUrl;
      ad.publicId = newAd.publicId;
      await ad.save();
    } else {
      ad = await AdImage.create(newAd);
    }

    res.status(200).json({ msg: "Ad image updated", adImage: ad });
  } catch (error) {
    console.error("Ad image update error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getAdImage = async (req, res) => {
  try {
    const ad = await AdImage.findOne();
    if (!ad) return res.status(404).json({ msg: "No ad image found" });
    res.status(200).json(ad);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = { uploadAdImage, getAdImage };
