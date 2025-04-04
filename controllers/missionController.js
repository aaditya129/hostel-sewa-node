const Mission = require('../models/Mission');

// Create
exports.createMission = async (req, res) => {
  try {
    const { title, heading } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Photo is required.' });
    }

    const newMission = new Mission({
      title,
      heading,
      photo: req.file.path, // from Cloudinary
    });

    await newMission.save();
    res.status(201).json(newMission);
  } catch (err) {
    console.error("CREATE ERROR:", JSON.stringify(err, null, 2));
    res.status(500).json({ error: 'Failed to create mission', details: err.message });
  }
};

// Get all
exports.getMissions = async (req, res) => {
  try {
    const missions = await Mission.find().sort({ createdAt: -1 });
    res.json(missions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch missions' });
  }
};

// Update
exports.updateMission = async (req, res) => {
  try {
    const { title, heading } = req.body;
    const mission = await Mission.findById(req.params.id);
    if (!mission) return res.status(404).json({ error: 'Not found' });

    const updated = await Mission.findByIdAndUpdate(
      req.params.id,
      {
        title,
        heading,
        photo: req.file ? req.file.path : mission.photo,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update mission' });
  }
};

// Delete
exports.deleteMission = async (req, res) => {
  try {
    const mission = await Mission.findByIdAndDelete(req.params.id);
    if (!mission) return res.status(404).json({ error: 'Not found' });

    res.json({ message: 'Mission deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete mission' });
  }
};
