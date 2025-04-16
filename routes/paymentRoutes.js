const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const {
  createPayment,
  getAllPayments,
  getPaymentsByUser,
  changePaymentStatus
} = require('../controllers/paymentController');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'payments',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    public_id: (req, file) => `payment-${Date.now()}-${file.originalname.split('.')[0]}`
  }
});

const upload = multer({ storage });

router.post('/', upload.single('paymentScreenshot'), createPayment);
router.get('/', getAllPayments);
router.get('/user/:userId', getPaymentsByUser);
router.put('/status/:id', changePaymentStatus);

module.exports = router;
