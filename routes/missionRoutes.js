const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const {
  createMission,
  getMissions,
  updateMission,
  deleteMission
} = require("../controllers/missionController");

const router = express.Router();

// Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "missions",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`
  },
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("photo"), createMission);
router.get("/", getMissions);
router.put("/:id", upload.single("photo"), updateMission);
router.delete("/:id", deleteMission);

module.exports = router;
