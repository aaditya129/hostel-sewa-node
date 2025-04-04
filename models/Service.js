const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
