const mongoose = require('mongoose');

const BookingConfirmationSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },
  confirmedBy: {
    type: String, // Admin username or ID
    required: true
  },
  confirmedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: "confirmed",
    enum: ["confirmed"]
  }
});

module.exports = mongoose.model("BookingConfirmation", BookingConfirmationSchema);
