const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  type: {
    type: String,
    enum: ['student', 'non-student'],
    required: true,
  },
  verificationCode: {
    type: String,  // Stores the 6-digit verification code
  },
  verificationExpires: {
    type: Date,  // Timestamp for code expiration
  },
  isVerified: {
    type: Boolean,
    default: false,  // By default, user is not verified
  },
});

module.exports = mongoose.model('User', userSchema);
