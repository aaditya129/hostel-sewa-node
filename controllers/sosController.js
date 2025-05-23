const SOS = require("../models/SosData");
const cloudinary = require("../config/cloudinary");

// Upload/update SOS contact images and video
exports.upsertSosData = async (req, res) => {
  try {
    const { contacts } = req.body;
    const files = req.files;

    const updatedContacts = contacts.map((contact, index) => {
      const file = files?.find(f => f.fieldname === `contactImage${index}`);
      return {
        name: contact.name,
        number: contact.number,
        imageUrl: file?.path || contact.imageUrl,
        imagePublicId: file?.filename || contact.imagePublicId,
      };
    });

    let sos = await SOS.findOne();
    if (!sos) {
      sos = new SOS({ contacts: updatedContacts });
    } else {
      sos.contacts = updatedContacts;
    }

    await sos.save();
    res.status(200).json({ message: "SOS contacts updated", sos });
  } catch (err) {
    console.error("SOS update error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete single contact
exports.deleteSosContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const sos = await SOS.findOne();
    if (!sos) return res.status(404).json({ msg: "SOS not found" });

    const contact = sos.contacts.id(contactId);
    if (contact.imagePublicId) {
      await cloudinary.uploader.destroy(contact.imagePublicId);
    }

    contact.remove();
    await sos.save();
    res.status(200).json({ message: "Contact removed", sos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload or update SOS video
exports.updateSosVideo = async (req, res) => {
  try {
    const file = req.file;
    const sos = await SOS.findOne();

    if (sos?.videoPublicId) {
      await cloudinary.uploader.destroy(sos.videoPublicId, { resource_type: "video" });
    }

    sos.videoUrl = file.path;
    sos.videoPublicId = file.filename;
    await sos.save();

    res.status(200).json({ message: "Video updated", sos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSosData = async (req, res) => {
  try {
    const sos = await SOS.findOne();
    res.status(200).json(sos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
