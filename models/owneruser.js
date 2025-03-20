const mongoose = require('mongoose');

const hostelOwnerSchema = new mongoose.Schema({
  fullName: { // Full Name
    type: String,
    required: true,
  },
  district: { // District
    type: String,
    required: true,
  },
  address: { // Address
    type: String,
    required: true,
  },
  addressDetails: { // Address Details
    type: String,
    required: true,
  },
  mobileNumber: { // Mobile Number
    type: String,
    required: true,
  },
  contactNumber: { // Contact Number
    type: String,
    default: null,
  },
  faxNumber: { // Fax Number
    type: String,
    default: null,
  },
  email: { // Email
    type: String,
    required: true,
    unique: true,
  },
  password: { // Password
    type: String,
    default: "12345"
  },
  website: { // Website
    type: String,
    default: null,
  },
  hostelType: { // Hostel Type
    type: String,
    enum: ['boys hostel', 'girls hostel'],
    required: true,
  },
  ownerDetail: { // Owner Detail
    type: String,
    required: true,
  },
  ownerContactNumber: { // Owner Contact Number
    type: String,
    required: true,
  },
  registrationNumber: { // Registration Number
    type: String,
    required: true,
    unique: true,
  },
  panNumber: { // PAN Number
    type: String,
    required: true,
    unique: true,
  },
  locationName: { // Location Name
    type: String,
    required: true,
  },
  minimumRate: { // Minimum Rate
    type: Number,
    required: true,
  },
  maximumRate: { // Maximum Rate
    type: Number,
    required: true,
  },
  hostelLogo: { // Hostel Logo
    type: String, // URL or file path
    default: null,
  },
  hostelPanPhoto: { // Hostel PAN Photo
    type: String, // URL or file path
    default: null,
  },
  hostelRegistrationPhoto: { // Hostel Registration Photo
    type: String, // URL or file path
    default: null,
  },
  description: { // Description
    type: String,
    default: null,
  },
  hostelOverview: { // Hostel Overview
    type: String,
    default: null,
  },
  approved: { // Approval Status
    type: Boolean,
    default: false,
  },
  role: { type: String, default: "owner" },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('HostelOwner', hostelOwnerSchema);
