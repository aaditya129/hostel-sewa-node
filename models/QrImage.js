const mongoose = require("mongoose");

const qrImageSchema = new mongoose.Schema({
  bankQr: { type: String, required: true },  // Cloudinary URL
  esewaQr: { type: String, required: true }, // Cloudinary URL
}, { timestamps: true });

module.exports = mongoose.model("QrImage", qrImageSchema);
