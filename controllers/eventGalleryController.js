const EventGallery = require('../models/EventGallery');
const cloudinary = require('../config/cloudinary');

// CREATE
exports.createEvent = async (req, res) => {
  try {
    const { eventName } = req.body;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    const imageUploads = await Promise.all(
      req.files.map(file =>
        cloudinary.uploader.upload(file.path).then(result => ({
          url: result.secure_url,
          public_id: result.public_id
        }))
      )
    );

    const newEvent = new EventGallery({ eventName, images: imageUploads });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error("CREATE EVENT ERROR:", err.message);
    res.status(500).json({ error: "Failed to create event" });
  }
};

// READ ALL
exports.getEvents = async (req, res) => {
  try {
    const events = await EventGallery.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// UPDATE (event name and add images)
exports.updateEvent = async (req, res) => {
  try {
    const { eventName } = req.body;
    const event = await EventGallery.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    let newImages = event.images;

    if (req.files && req.files.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.map(file =>
          cloudinary.uploader.upload(file.path).then(result => ({
            url: result.secure_url,
            public_id: result.public_id
          }))
        )
      );
      newImages = [...newImages, ...uploadedImages];
    }

    event.eventName = eventName || event.eventName;
    event.images = newImages;
    await event.save();

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to update event" });
  }
};

// DELETE
exports.deleteEvent = async (req, res) => {
  try {
    const event = await EventGallery.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Optionally delete images from Cloudinary
    await Promise.all(
      event.images.map(img => cloudinary.uploader.destroy(img.public_id))
    );

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event" });
  }
};
// GET ALL IMAGES ONLY (flattened array)
exports.getAllImages = async (req, res) => {
    try {
      const events = await EventGallery.find({}, 'images'); // only select images field
      const allImages = events.flatMap(event => event.images); // flatten array of arrays
      res.json(allImages); // returns [{url, public_id}, ...]
    } catch (err) {
      console.error('Error fetching all images:', err);
      res.status(500).json({ error: 'Failed to fetch all images' });
    }
  };
  