const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hostelName: {  // ✅ Added hostel name field
    type: String,
    required: true
  },
  seater: {
    type: String,
    required: true
  },
  numberOfTenants: {
    type: Number,
    required: true
  },
  lengthOfStay: {
    type: Number,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  emailAddress: {
    type: String,
    required: true
  },
  paymentOption: {
    type: String,
    required: true,
    enum: ['bank', 'esewa']
  },
  paymentScreenshot: {
    type: String
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'in-progress', 'completed','canceled']
  },
  advanceAmount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  confirmation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BookingConfirmation",
    default: null
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
