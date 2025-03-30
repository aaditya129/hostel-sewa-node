const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const {
  register,
  login,
  registerOwner,
  loginOwner,
  getUserDetails,
  getAllHostelOwners,
  verifyEmail,
  getAllUsers,
  approveHostelOwner
} = require('../controllers/authController');

const router = express.Router();

// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile-pictures',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

// Define routes
router.post('/register', upload.single('profilePicture'), register);
router.post(
  '/registerOwner',
  upload.fields([
    { name: 'hostelLogo', maxCount: 1 },
    { name: 'hostelPanPhoto', maxCount: 1 },
    { name: 'hostelRegistrationPhoto', maxCount: 1 },
  ]),
  registerOwner
);
router.post('/login', login);
router.post('/loginOwner', loginOwner);
router.get('/userdetails/:id', getUserDetails);
router.get('/owners', getAllHostelOwners);
router.get('/users', getAllUsers);
router.post('/verify-email', verifyEmail);
router.put("/owners/:id/approve", approveHostelOwner);

module.exports = router;
