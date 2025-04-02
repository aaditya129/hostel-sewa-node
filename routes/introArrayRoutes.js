const express = require('express');
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const {
  createIntroArray,
  updateIntroArray,
  getIntroImageByIndex,
  getSortedArrayByIndex,
} = require('../controllers/introArrayController');

// ✅ Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "intro-section",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) => `intro-${Date.now()}-${file.originalname.split('.')[0]}`,
  },
});

const upload = multer({ storage });

// ✅ Routes
router.post('/', upload.single('image'), createIntroArray);      // Create (max 2)
router.put('/:id', upload.single('image'), updateIntroArray);    // Edit
router.get('/get-intro/:index', getIntroImageByIndex);           // Get intro + image
router.get('/get-array/:index', getSortedArrayByIndex);          // Get sorted array

module.exports = router;
