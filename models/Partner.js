const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['associate-partner', 'college', 'payment'], // fixed types
  },
  photo: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Partner', partnerSchema);
