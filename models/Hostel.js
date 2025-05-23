const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hostel name is required"],
      trim: true,
    },
    contact: {
      type: String,
      required: [true, "Contact number is required"],
      match: [
        /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
        "Invalid contact number",
      ],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
    },
    province: {
      type: String,
      required: [true, "Province is required"],
      trim: true,
    },
    area: {
      type: String,
      trim: true,
    },
    mapUrl: {
      type: String,
      required: [true, "Google Maps URL is required"],
      validate: {
        validator: function (url) {
          return /^https:\/\/www\.google\.com\/maps/.test(url);
        },
        message: "Invalid Google Maps URL",
      },
    },
    youtubeUrl: {
      type: String,
      validate: {
        validator: function (url) {
          return !url || /^https:\/\/(www\.)?youtube\.com\/embed\/[A-Za-z0-9_-]+/.test(url);
        },
        message: "Invalid YouTube embed URL",
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    totalRooms: {
      type: Number,
      min: [0, "Rooms cannot be negative"],
    },
    bathrooms: {
      type: Number,
      min: [0, "Bathrooms cannot be negative"],
    },
    floors: {
      type: Number,
      min: [0, "Floors cannot be negative"],
    },
    beds: {
      type: Number,
      min: [0, "Beds cannot be negative"],
    },
    students: {
      type: Number,
      min: [0, "Students cannot be negative"],
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      maxlength: [500, "Overview cannot exceed 500 characters"],
    },
    features: {
      type: [String],
      validate: {
        validator: (array) => array.length > 0,
        message: "At least one feature must be selected",
      },
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HostelOwner",
      default: null,
    },
    type: {
      type: String,
      required: [true, "Hostel type is required"],
      enum: ["Boys", "Girls", "Co-ed"],
      trim: true,
    },
    vip: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hostel", hostelSchema);
