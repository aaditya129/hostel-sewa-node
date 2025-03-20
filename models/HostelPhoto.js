const mongoose = require("mongoose");

const hostelPhotoSchema = new mongoose.Schema({
    hostelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hostel",
        required: true
    },
    coverPhoto: {
        type: String, // Store image URL
        default: null
    },
    photos: {
        type: [String], // Array of image URLs for multiple photos
        default: []
    }
}, { timestamps: true });

const HostelPhoto = mongoose.model("HostelPhoto", hostelPhotoSchema);
module.exports = HostelPhoto;
