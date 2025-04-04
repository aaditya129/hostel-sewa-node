const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  facebook: { type: String },
  twitter: { type: String },
  google: { type: String },
  instagram: { type: String },
  tiktok: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
