const express = require('express');
const router = express.Router();
const { createContact, getAllContacts } = require('../controllers/contactController');

// Route to create a new contact inquiry
router.post('/', createContact);

// Route to get all contact inquiries
router.get('/', getAllContacts);

module.exports = router;
