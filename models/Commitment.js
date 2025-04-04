const mongoose = require('mongoose');

const commitmentSchema = new mongoose.Schema({
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
  image: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Commitment', commitmentSchema);
