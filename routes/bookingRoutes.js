const express = require("express");
const {
  createBooking,
  confirmBooking,
  cancelBooking,
  getAllBookings,
  deleteBooking,
  getBookingsByUser
} = require("../controllers/bookingController");

const auth = require("../middleware/authMiddleware"); // Protect Routes
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "uploads/payment_screenshots/" });

router.post("/", auth, upload.single("paymentScreenshot"), createBooking);
// router.post("/", auth, createBooking);
router.put("/confirm", auth, confirmBooking);
router.put("/cancel/:id", auth, cancelBooking);
router.get("/",getAllBookings);
router.delete("/:id", auth, deleteBooking);
router.get("/user/:userId", getBookingsByUser);


module.exports = router;
