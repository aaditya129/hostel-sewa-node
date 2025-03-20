const mongoose = require('mongoose');

// Review Schema
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  details: {
    type: String, // Long description of the product
    required: true
  },
  features: {
    type: [String], // Array of features
    default: [] // Initialize as an empty array
  },
  available: {
    type: Boolean,
    default: true, // Default to available
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Furniture & Amenities",
      "Food & Kitchen Items",
      "Electronics",
      "Hygiene Products",
      "Utilities",
      "Services",
    ], // Hostel-specific product categories
  },
  reviews: [reviewSchema], // Embedding reviews as a sub-document array
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// Method to calculate average rating
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    return 0;
  }
  
  const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return (totalRating / this.reviews.length).toFixed(1);
};

// Middleware to update average rating before saving
productSchema.pre('save', function(next) {
  this.rating = this.calculateAverageRating();
  next();
});

// Compile models
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
