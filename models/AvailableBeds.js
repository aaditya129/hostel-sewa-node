const mongoose = require("mongoose");

const availableBedsSchema = new mongoose.Schema(
  {
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel", // Linking to Hostel Model
      required: true,
    },
    roomType: {
      type: String,
      required: true, // Example: "Single", "2 Sharing"
      enum: ["Single", "2 Sharing", "3 Sharing", "4 Sharing", "5 Sharing"],
    },
    perBedPrice: {
      type: Number,
      required: true, // Price per bed
    },
    bedsAvailable: {
      type: Number,
      required: true,
      min: 0, // Ensures it doesn't go negative
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AvailableBeds", availableBedsSchema);
