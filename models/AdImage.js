const mongoose = require("mongoose");

const adImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String, // for deleting from Cloudinary
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("AdImage", adImageSchema);
