const Payment = require('../models/Payment');
const Product = require('../models/Product'); // ✅ Adjust the path as needed
// Create
exports.createPayment = async (req, res) => {
    try {
      const { userId, productId, quantity, paymentMethod } = req.body;
      const paymentScreenshot = req.file?.path;
  
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ error: 'Product not found' });
  
      const totalAmount = product.price * Number(quantity);
  
      const newPayment = new Payment({
        user: userId,
        products: [{
          productId,
          name: product.name,
          price: product.price,
          quantity,
        }],
        totalAmount,
        paymentMethod,
        paymentScreenshot,
      });
  
      await newPayment.save();
      res.status(201).json({ message: 'Payment created', data: newPayment });
    } catch (err) {
      console.error('Payment creation error:', err); // ✅ Show exact backend error
      res.status(500).json({ error: 'Failed to create payment' });
    }
  };
  

// Get all
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('user');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get payments' });
  }
};

// Get by user
exports.getPaymentsByUser = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.params.userId });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user payments' });
  }
};

// Change status
exports.changePaymentStatus = async (req, res) => {
    try {
      const { status } = req.body;
      const updated = await Payment.findByIdAndUpdate(
        req.params.id,
        { paymentStatus: status },
        { new: true }
      );
      res.json(updated);
    } catch (err) {
      console.error("Failed to update status:", err);
      res.status(500).json({ error: 'Failed to update status' });
    }
  };
  
