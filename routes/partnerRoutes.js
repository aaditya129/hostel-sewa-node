const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const {
  createPartner,
  getPartners,
  updatePartner,
  deletePartner,
  getPaymentPartners,
  getAssociatePartners,
  getAssociateColleges
} = require('../controllers/partnerController');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'partners',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`
  },
});

const upload = multer({ storage });

// CRUD
router.post('/', upload.single('photo'), createPartner);
router.get('/', getPartners);
router.put('/:id', upload.single('photo'), updatePartner);
router.delete('/:id', deletePartner);

// Type-specific routes
router.get('/payment-partners', getPaymentPartners);
router.get('/associate-partners', getAssociatePartners);
router.get('/associate-colleges', getAssociateColleges);

module.exports = router;
