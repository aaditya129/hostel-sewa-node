const express = require("express");
const router = express.Router();
const {
  createBooking,
  confirmBooking,
  cancelBooking,
  getAllBookings,
  deleteBooking,
  getBookingsByUser
} = require("../controllers/bookingController");

const auth = require("../middleware/authMiddleware");

// ✅ Cloudinary Setup Inline
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "payment_screenshots",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) => `payment-${Date.now()}-${file.originalname.split('.')[0]}`
  },
});

const upload = multer({ storage });

// ✅ Routes
router.post("/", auth, upload.single("paymentScreenshot"), createBooking);
router.put("/confirm",  confirmBooking);
router.put("/cancel/:id",  cancelBooking);
router.get("/", getAllBookings);
router.delete("/:id",  deleteBooking);
router.get("/user/:userId", getBookingsByUser);

module.exports = router;
