const express = require("express");
const {
  addAvailableBeds,
  updateAvailableBeds,
  getAvailableBedsByHostel,
  deleteAvailableBeds,
} = require("../controllers/availableBedsController");

const router = express.Router();

// Add available beds
router.post("/", addAvailableBeds);

// Get all available beds for a specific hostel
router.get("/:hostelId", getAvailableBedsByHostel);

// Update available beds
router.put("/", updateAvailableBeds);

// Delete available beds
router.delete("/:bedId", deleteAvailableBeds);

module.exports = router;
