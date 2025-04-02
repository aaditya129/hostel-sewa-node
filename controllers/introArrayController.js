const IntroArray = require('../models/IntroArray');

// Create (max 2 only)
exports.createIntroArray = async (req, res) => {
  try {
    const count = await IntroArray.countDocuments();
    if (count >= 2) return res.status(400).json({ message: 'Only 2 entries allowed' });

    const { intro, array } = req.body;
    const image = req.file?.path;

    const newEntry = new IntroArray({
      intro,
      image,
      array: JSON.parse(array),
    });

    const saved = await newEntry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit
exports.updateIntroArray = async (req, res) => {
  try {
    const update = { ...req.body };

    if (req.file?.path) {
      update.image = req.file.path;
    }

    if (update.array) {
      update.array = JSON.parse(update.array);
    }

    const updated = await IntroArray.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'Entry not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get intro and image by index (1 or 2)
exports.getIntroImageByIndex = async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    if (![1, 2].includes(index)) return res.status(400).json({ message: 'Index must be 1 or 2' });

    const doc = await IntroArray.findOne().skip(index - 1).select('intro image');
    if (!doc) return res.status(404).json({ message: 'Not found' });

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get array sorted by positionNumber
exports.getSortedArrayByIndex = async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    if (![1, 2].includes(index)) return res.status(400).json({ message: 'Index must be 1 or 2' });

    const doc = await IntroArray.findOne().skip(index - 1).select('array');
    if (!doc) return res.status(404).json({ message: 'Not found' });

    const sorted = doc.array.sort((a, b) => a.positionNumber - b.positionNumber);
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
