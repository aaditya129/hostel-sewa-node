const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const {
    uploadCoverPhoto,
    uploadPhotos,
    deleteCoverPhoto,
    deletePhoto,
    getHostelPhotos
} = require("../controllers/hostelPhotoController");

const router = express.Router();

// ✅ Cloudinary Storage Configuration (Inline)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
        folder: "hostel_photos",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    }),
});

const upload = multer({ storage });

// ✅ Routes
router.post("/:hostelId/cover", upload.single("coverPhoto"), uploadCoverPhoto);
router.post("/:hostelId/photos", upload.array("photos", 10), uploadPhotos);
router.delete("/:hostelId/cover", deleteCoverPhoto);
router.delete("/:hostelId/photos", deletePhoto);
router.get("/:hostelId", getHostelPhotos);

module.exports = router;
