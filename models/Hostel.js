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
      required: [true, "Area is required"],
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
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    totalRooms: {
      type: Number,
      required: [true, "Total rooms are required"],
      min: [1, "There must be at least one room"],
    },
    bathrooms: {
      type: Number,
      required: [true, "Number of bathrooms is required"],
      min: [1, "There must be at least one bathroom"],
    },
    floors: {
      type: Number,
      required: [true, "Number of floors is required"],
      min: [1, "There must be at least one floor"],
    },
    beds: {
      type: Number,
      required: [true, "Number of beds is required"],
      min: [1, "There must be at least one bed"],
    },
    students: {
      type: Number,
      required: [true, "Number of students is required"],
      min: [1, "There must be at least one student"],
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
    // ✅ Assign Hostel to an Owner
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HostelOwner", // References the owner
      default: null, // Initially, no owner is assigned
    },
    // ✅ Add Hostel Type
    type: {
      type: String,
      required: [true, "Hostel type is required"],
      enum: ["Boys", "Girls", "Co-ed"], // Restrict to these types
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model("Hostel", hostelSchema);
