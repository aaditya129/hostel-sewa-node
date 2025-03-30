const QrImage = require("../models/QrImage");

// Upload QR images
exports.uploadQrImages = async (req, res) => {
  try {
    const bankQr = req.files["bankQr"]?.[0]?.path;
    const esewaQr = req.files["esewaQr"]?.[0]?.path;

    if (!bankQr || !esewaQr) {
      return res.status(400).json({ message: "Both QR images are required" });
    }

    // Optional: Delete existing one (if only one should exist)
    await QrImage.deleteMany();

    const newQr = new QrImage({ bankQr, esewaQr });
    await newQr.save();

    res.status(201).json({ message: "QR images uploaded", data: newQr });
  } catch (err) {
    console.error("❌ Upload error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get both QR images
exports.getQrImages = async (req, res) => {
  try {
    const qr = await QrImage.findOne().sort({ createdAt: -1 });

    if (!qr) return res.status(404).json({ message: "No QR images found" });

    res.status(200).json(qr);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get bank QR only
exports.getBankQr = async (req, res) => {
  try {
    const qr = await QrImage.findOne().sort({ createdAt: -1 });
    if (!qr) return res.status(404).json({ message: "Not found" });

    res.json({ bankQr: qr.bankQr });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get eSewa QR only
exports.getEsewaQr = async (req, res) => {
  try {
    const qr = await QrImage.findOne().sort({ createdAt: -1 });
    if (!qr) return res.status(404).json({ message: "Not found" });

    res.json({ esewaQr: qr.esewaQr });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update one or both QR images
exports.updateQrImages = async (req, res) => {
    try {
      const bankQr = req.files["bankQr"]?.[0]?.path;
      const esewaQr = req.files["esewaQr"]?.[0]?.path;
  
      const qr = await QrImage.findOne().sort({ createdAt: -1 });
      if (!qr) return res.status(404).json({ message: "QR record not found" });
  
      if (bankQr) qr.bankQr = bankQr;
      if (esewaQr) qr.esewaQr = esewaQr;
  
      await qr.save();
  
      res.status(200).json({ message: "QR image(s) updated", data: qr });
    } catch (err) {
      console.error("❌ Update error:", err.message);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  