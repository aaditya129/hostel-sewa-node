const mongoose = require("mongoose");

const sosContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  imageUrl: { type: String },     // Cloudinary URL
  imagePublicId: { type: String } // For deletion
});

const sosSchema = new mongoose.Schema({
  contacts: [sosContactSchema],
  videoUrl: { type: String }, // Could be a Cloudinary video URL
  videoPublicId: { type: String } // Optional: to delete old video
});

module.exports = mongoose.model("SOS", sosSchema);
