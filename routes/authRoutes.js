const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { 
  register, 
  login, 
  registerOwner, 
  loginOwner, 
  getUserDetails, 
  getAllHostelOwners,
  verifyEmail,
  getAllUsers  // Add this function in the controller
} = require('../controllers/authController');

const router = express.Router();

// Check if uploads directory exists, create if not
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer configuration for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use validated directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Define routes
router.post('/register', upload.single('profilePicture'), register);
router.post('/registerOwner', registerOwner);
router.post('/login', login);
router.post('/loginOwner', loginOwner);
router.get('/userdetails/:id', getUserDetails); // Pass user ID as a route parameter
router.get("/owners", getAllHostelOwners);
router.get('/users', getAllUsers); 

// New Route for email verification
router.post('/verify-email', verifyEmail); // User enters verification code

module.exports = router;
