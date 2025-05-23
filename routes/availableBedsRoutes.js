const express = require("express");
const {
  addAvailableBeds,
  updateAvailableBeds,
  getAvailableBedsByHostel,
  deleteAvailableBeds,
  getHostelsByRoomType,
} = require("../controllers/availableBedsController");

const router = express.Router();

router.post("/hostels-by-room-type", getHostelsByRoomType);
// Add available beds
router.post("/", addAvailableBeds);

// Get all available beds for a specific hostel

// Update available beds
router.put("/", updateAvailableBeds);

// Delete available beds
router.delete("/:bedId", deleteAvailableBeds);

router.get("/:hostelId", getAvailableBedsByHostel);

module.exports = router;
