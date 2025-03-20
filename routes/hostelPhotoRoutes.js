const express = require("express");
const multer = require("multer");
const {
    uploadCoverPhoto,
    uploadPhotos,
    deleteCoverPhoto,
    deletePhoto,
    getHostelPhotos
} = require("../controllers/hostelPhotoController");

const router = express.Router();

// Multer Storage (Local Storage, replace with S3/Cloudinary if needed)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Save files to 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// Routes
router.post("/:hostelId/cover", upload.single("coverPhoto"), uploadCoverPhoto);
router.post("/:hostelId/photos", upload.array("photos", 10), uploadPhotos);
router.delete("/:hostelId/cover", deleteCoverPhoto);
router.delete("/:hostelId/photos", deletePhoto);
router.get("/:hostelId", getHostelPhotos);

module.exports = router;
