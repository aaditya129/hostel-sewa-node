const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {createCertificate,getCertificates,updateCertificate,deleteCertificate} = require('../controllers/certificateController');

// Multer setup for file upload
const storage = multer.diskStorage({
    destination: './uploads/', // Ensure this folder exists
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// API routes
router.post('/', upload.single('photo'),  createCertificate);
router.get('/',  getCertificates);
router.put('/:id', upload.single('photo'),  updateCertificate);
router.delete('/:id',  deleteCertificate);

module.exports = router;
