const ContactInfo = require('../models/ContactInfo');

// Create or Update (singleton logic)
exports.upsertContactInfo = async (req, res) => {
  try {
    const data = req.body;
    let contact = await ContactInfo.findOne();

    if (contact) {
      contact = await ContactInfo.findByIdAndUpdate(contact._id, data, { new: true });
    } else {
      contact = await ContactInfo.create(data);
    }

    res.status(200).json(contact);
  } catch (err) {
    console.error("UPSERT ERROR:", JSON.stringify(err, null, 2));
    res.status(500).json({ error: 'Failed to save contact info' });
  }
};

// Get Contact Info
exports.getContactInfo = async (req, res) => {
  try {
    const contact = await ContactInfo.findOne();
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contact info' });
  }
};

exports.updateContactInfo = async (req, res) => {
    try {
      const contact = await ContactInfo.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
  
      if (!contact) {
        return res.status(404).json({ error: 'Contact info not found' });
      }
  
      res.json(contact);
    } catch (err) {
      console.error("UPDATE ERROR:", JSON.stringify(err, null, 2));
      res.status(500).json({ error: 'Failed to update contact info' });
    }
  };
  
