const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const {
  createCommitment,
  getCommitments,
  updateCommitment,
  deleteCommitment,
} = require("../controllers/commitmentController");

const router = express.Router();

// ✅ Cloudinary storage for commitments
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "commitments",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`,
  },
});

const upload = multer({ storage });

// ✅ Routes
router.post("/", upload.single("image"), createCommitment);
router.get("/", getCommitments);
router.put("/:id", upload.single("image"), updateCommitment);
router.delete("/:id", deleteCommitment);

module.exports = router;
