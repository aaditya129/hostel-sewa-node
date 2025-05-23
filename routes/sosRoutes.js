const express = require("express");
const router = express.Router();
const {
  getSosData,
  upsertSosData,
  deleteSosContact,
  updateSosVideo
} = require("../controllers/sosController");

const upload = require("../middleware/cloudinaryUpload");

// For multiple contact images (indexed by field name like contactImage0, contactImage1...)
router.post("/upsert", upload.any(), upsertSosData);

// Upload video (single)
router.put("/video", upload.single("video"), updateSosVideo);

router.get("/", getSosData);
router.delete("/contact/:contactId", deleteSosContact);

module.exports = router;
