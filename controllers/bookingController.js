const Booking = require('../models/Booking');
const BookingConfirmation = require("../models/BookingConfirmation");
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure Uploads Directory Exists
const uploadDir = 'uploads/payment_screenshots';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage }).single('paymentScreenshot');

// ✅ Create a Booking (Includes Hostel Name)
const createBooking = async (req, res) => {
  console.log("Received Booking Data:", req.body); // ✅ Log request body
  console.log("Received File:", req.file); // ✅ Log uploaded file

  if (!req.user) {
    return res.status(401).json({ msg: "Unauthorized. Please log in." });
  }

  const { hostelName, seater, numberOfTenants, lengthOfStay, fullName, address, mobileNumber, emailAddress, paymentOption, advanceAmount } = req.body;

  // ✅ Log received fields for debugging
  console.log("Hostel Name:", hostelName);
  console.log("Seater:", seater);
  console.log("Number of Tenants:", numberOfTenants);
  console.log("Length of Stay:", lengthOfStay);
  console.log("Full Name:", fullName);
  console.log("Address:", address);
  console.log("Mobile Number:", mobileNumber);
  console.log("Email Address:", emailAddress);
  console.log("Payment Option:", paymentOption);
  console.log("Advance Amount:", advanceAmount);

  // ✅ Ensure all fields are present
  if (!hostelName || !seater || !numberOfTenants || !lengthOfStay || !fullName || !address || !mobileNumber || !emailAddress || !paymentOption || !advanceAmount) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    const newBooking = new Booking({
      userId: req.user.id, // ✅ Associate booking with user
      hostelName,
      seater,
      numberOfTenants,
      lengthOfStay,
      fullName,
      address,
      mobileNumber,
      emailAddress,
      paymentOption,
      advanceAmount,
      paymentScreenshot: req.file ? req.file.path : undefined,
      status: "pending",
    });

    await newBooking.save();
    res.status(201).json({ msg: "Booking created successfully", booking: newBooking });
  } catch (err) {
    console.error("Error saving booking:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


// ✅ Get Bookings by User ID
const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("Fetching bookings for user ID:", userId); // Debugging log

    const bookings = await Booking.find({ userId }).populate("confirmation");

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user." });
    }

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching bookings by user ID:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// ✅ Confirm a Booking (Admin)
const confirmBooking = async (req, res) => {
  try {
    console.log("Request from:", req.user); // 🔍 Logs authenticated user
    console.log("Booking ID received:", req.body.bookingId); // 🔍 Logs received ID

    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ message: "Missing bookingId" });

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status === "completed") {
      return res.status(400).json({ message: "Booking already confirmed" });
    }

    booking.status = "completed";
    await booking.save();

    res.status(200).json({ message: "Booking confirmed successfully", booking });
  } catch (error) {
    console.error("Error confirming booking:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// ✅ Update Booking Status (Admin)
const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'in-progress', 'completed'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status value' });
  }

  try {
    const booking = await Booking.findById(id);

    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    booking.status = status;
    await booking.save();

    res.status(200).json({ msg: 'Booking status updated successfully', booking });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ✅ Get All Bookings (Admin View) - Now Includes Hostel Name
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("confirmation");
    res.status(200).json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ✅ Cancel a Booking (Change Status to "canceled")
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Find booking by ID
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update status to "canceled"
    booking.status = "canceled";
    await booking.save();

    res.status(200).json({ message: "Booking canceled successfully", booking });
  } catch (error) {
    console.error("Error canceling booking:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Hard Delete a Booking (Remove from DB)
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete booking
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Export all controllers
module.exports = { createBooking, updateBookingStatus, getAllBookings, confirmBooking, cancelBooking, deleteBooking,getBookingsByUser };


