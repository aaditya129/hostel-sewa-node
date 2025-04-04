const express = require('express');
const router = express.Router();
const {
  upsertContactInfo,
  getContactInfo,
  updateContactInfo
} = require('../controllers/contactInfoController');

router.get('/', getContactInfo);
router.post('/', upsertContactInfo);
router.put('/:id', updateContactInfo); // ✅ added

module.exports = router;
