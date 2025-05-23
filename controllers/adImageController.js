const AdImage = require("../models/AdImage");
const cloudinary = require('../config/cloudinary');

const uploadAdImage = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ msg: "Image files are required" });
    }

    const images = [];
    const gifs = [];

    for (const file of files) {
      const isGif = file.mimetype === 'image/gif';
      const item = {
        imageUrl: file.path,
        publicId: file.filename
      };

      if (isGif) {
        if (gifs.length < 3) gifs.push(item);
      } else {
        if (images.length < 3) images.push(item);
      }
    }

    if (images.length === 0 && gifs.length === 0) {
      return res.status(400).json({ msg: "No valid images or gifs uploaded (max 3 each)" });
    }

    const ad = await AdImage.create({ images, gifs });

    res.status(200).json({ msg: "Ad image group uploaded", adImage: ad });
  } catch (error) {
    console.error("Ad image upload error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};


const getImageAds = async (req, res) => {
  try {
    const ads = await AdImage.find().sort({ createdAt: -1 });
    const imageOnly = ads.flatMap(ad => ad.images || []);
    res.status(200).json(imageOnly);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getGifAds = async (req, res) => {
  try {
    const ads = await AdImage.find().sort({ createdAt: -1 });
    const gifOnly = ads.flatMap(ad => ad.gifs || []);
    res.status(200).json(gifOnly);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
const deleteAdItem = async (req, res) => {
  const { publicId } = req.params;

  try {
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Remove from both arrays in all ads
    const ad = await AdImage.findOneAndUpdate(
      {
        $or: [
          { "images.publicId": publicId },
          { "gifs.publicId": publicId }
        ]
      },
      {
        $pull: {
          images: { publicId },
          gifs: { publicId }
        }
      },
      { new: true }
    );

    if (!ad) return res.status(404).json({ msg: "Image/GIF not found" });

    res.status(200).json({ msg: "Deleted successfully", ad });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = { uploadAdImage,getImageAds, getGifAds , deleteAdItem };

