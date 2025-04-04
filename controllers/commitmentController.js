const Commitment = require('../models/Commitment');

exports.createCommitment = async (req, res) => {
    try {
      const { heading, description } = req.body;
  
      console.log("REQ BODY:", JSON.stringify(req.body, null, 2));
      console.log("REQ FILE:", JSON.stringify(req.file, null, 2));
  
      if (!req.file) {
        return res.status(400).json({ error: 'Image is required.' });
      }
  
      const newCommitment = new Commitment({
        heading,
        description,
        image: req.file.path,
      });
  
      await newCommitment.save();
      res.status(201).json(newCommitment);
    } catch (err) {
      console.error("CREATE ERROR:", JSON.stringify(err, null, 2));
      res.status(500).json({ error: 'Failed to create commitment', details: err.message });
    }
  };
  
  

exports.getCommitments = async (req, res) => {
  try {
    const data = await Commitment.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch commitments' });
  }
};

exports.updateCommitment = async (req, res) => {
  try {
    const { heading, description } = req.body;
    const commitment = await Commitment.findById(req.params.id);
    if (!commitment) return res.status(404).json({ error: 'Not found' });

    const imageUrl = req.file ? req.file.path : commitment.image;

    const updated = await Commitment.findByIdAndUpdate(
      req.params.id,
      { heading, description, image: imageUrl },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update commitment' });
  }
};

exports.deleteCommitment = async (req, res) => {
  try {
    const commitment = await Commitment.findByIdAndDelete(req.params.id);
    if (!commitment) return res.status(404).json({ error: 'Not found' });

    res.json({ message: 'Commitment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete commitment' });
  }
};
