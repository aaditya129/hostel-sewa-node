const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const {
  createCertificate,
  getCertificates,
  updateCertificate,
  deleteCertificate
} = require('../controllers/certificateController');

// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'certificates',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    public_id: (req, file) => file.originalname.split('.')[0],
  },
});

const upload = multer({ storage });

// API routes
router.post('/', upload.single('photo'), createCertificate);
router.get('/', getCertificates);
router.put('/:id', upload.single('photo'), updateCertificate);
router.delete('/:id', deleteCertificate);

module.exports = router;
