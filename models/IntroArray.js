const mongoose = require('mongoose');

const ArrayItemSchema = new mongoose.Schema({
  name: String,
  number: Number,
  positionNumber: Number,
  positionName: String,
});

const IntroArraySchema = new mongoose.Schema({
  intro: String,
  image: String,
  array: [ArrayItemSchema],
});

module.exports = mongoose.model('IntroArray', IntroArraySchema);



