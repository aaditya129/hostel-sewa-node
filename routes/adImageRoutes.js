const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require('../config/cloudinary');
const { uploadAdImage, getAdImage } = require("../controllers/adImageController");

// Cloudinary Multer config
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "adImages",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: () => "hostel_ad_image", // overwrite existing one
  },
});
const upload = multer({ storage });

// Routes
router.post("/upload-ad", upload.single("adImage"), uploadAdImage);
router.get("/ad", getAdImage);

module.exports = router;
