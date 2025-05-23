const mongoose = require("mongoose");

const adImageSchema = new mongoose.Schema({
  images: [
    {
      imageUrl: { type: String, required: true },
      publicId: { type: String, required: true },
    }
  ],
  gifs: [
    {
      imageUrl: { type: String, required: true },
      publicId: { type: String, required: true },
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("AdImage", adImageSchema);
