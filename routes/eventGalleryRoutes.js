const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getAllImages
} = require('../controllers/eventGalleryController');

// Multer setup for multiple files
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'event-gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`,
  },
});
const upload = multer({ storage });

router.post('/', upload.array('images', 10), createEvent);
router.get('/', getEvents);
router.put('/:id', upload.array('images', 10), updateEvent);
router.delete('/:id', deleteEvent);
router.get('/all-images', getAllImages); 

module.exports = router;
