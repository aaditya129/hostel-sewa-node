const express = require('express');
const { createInquiry , getAllInquiries , updateInquiryStatus} = require('../controllers/inquiryController');
const router = express.Router();

// @route   POST /api/inquiries
// @desc    Create a new inquiry
router.post('/', createInquiry);
router.get('/', getAllInquiries);
router.put('/:id/status', updateInquiryStatus);

module.exports = router;
