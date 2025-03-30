const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const {
  uploadQrImages,
  getQrImages,
  getBankQr,
  getEsewaQr,
  updateQrImages
} = require("../controllers/qrController");

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "qr_codes",
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => `${file.fieldname}-${Date.now()}`
  },
});

const upload = multer({ storage });

// POST /api/qr
router.post("/", upload.fields([{ name: "bankQr" }, { name: "esewaQr" }]), uploadQrImages);

// GET
router.get("/", getQrImages);          // both
router.get("/bank", getBankQr);        // only bank QR
router.get("/esewa", getEsewaQr);      // only esewa QR
router.put("/", upload.fields([{ name: "bankQr" }, { name: "esewaQr" }]), updateQrImages);

module.exports = router;
