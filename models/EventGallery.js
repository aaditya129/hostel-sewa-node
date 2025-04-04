const mongoose = require('mongoose');

const eventGallerySchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    trim: true,
  },
  images: [
    {
      url: String,
      public_id: String, // For deletion from Cloudinary if needed
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('EventGallery', eventGallerySchema);
