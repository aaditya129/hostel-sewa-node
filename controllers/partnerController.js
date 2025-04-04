const Partner = require('../models/Partner');

// Create
exports.createPartner = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Photo is required.' });
    }

    const newPartner = new Partner({
      name,
      type,
      photo: req.file.path,
    });

    await newPartner.save();
    res.status(201).json(newPartner);
  } catch (err) {
    console.error("CREATE ERROR:", JSON.stringify(err, null, 2));
    res.status(500).json({ error: 'Failed to create partner', details: err.message });
  }
};

// Get all (with optional filter)
exports.getPartners = async (req, res) => {
  try {
    const filter = req.query.type ? { type: req.query.type } : {};
    const partners = await Partner.find(filter).sort({ createdAt: -1 });
    res.json(partners);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
};

// Update
exports.updatePartner = async (req, res) => {
  try {
    const { name, type } = req.body;
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    const updated = await Partner.findByIdAndUpdate(
      req.params.id,
      {
        name,
        type,
        photo: req.file ? req.file.path : partner.photo,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update partner' });
  }
};

// Delete
exports.deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    res.json({ message: 'Partner deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete partner' });
  }
};

exports.getPaymentPartners = async (req, res) => {
    try {
      const partners = await Partner.find({ type: 'payment' }).sort({ createdAt: -1 });
      res.json(partners);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch payment partners' });
    }
  };
  
  exports.getAssociatePartners = async (req, res) => {
    try {
      const partners = await Partner.find({ type: 'associate-partner' }).sort({ createdAt: -1 });
      res.json(partners);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch associate partners' });
    }
  };
  
  exports.getAssociateColleges = async (req, res) => {
    try {
      const partners = await Partner.find({ type: 'college' }).sort({ createdAt: -1 });
      res.json(partners);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch associate colleges' });
    }
  };
  