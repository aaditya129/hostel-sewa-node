const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String, // 'esewa', 'khalti', 'bank', etc.
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  transactionId: {
    type: String,
  },
  paidAt: {
    type: Date,
  },
  paymentScreenshot: {
    type: String, // Cloudinary image URL
    default: '',
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);

