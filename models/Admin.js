const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" }, // Ensuring only admins use this model
});

module.exports = mongoose.model("Admin", AdminSchema);
