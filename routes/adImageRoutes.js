const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require('../config/cloudinary');
const {
  uploadAdImage,
  getImageAds,
  getGifAds,
  deleteAdItem
} = require("../controllers/adImageController");

// Cloudinary Multer config
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "adImages",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    public_id: () => Date.now().toString(), // unique filenames
  },
});
const upload = multer({ storage });

// Routes
router.post("/upload-ad", upload.array("adImages", 10), uploadAdImage);
router.get("/ads/images", getImageAds);
router.get("/ads/gifs", getGifAds);
router.delete("/ads/:publicId", deleteAdItem);

module.exports = router;
