const Certificate = require('../models/certificateModel');

// Create a new certificate
exports.createCertificate = async (req, res) => {
    try {
        const { title } = req.body;
        const photo = req.file ? req.file.path : null; 

        if (!title || !photo) {
            return res.status(400).json({ message: "Title and photo are required" });
        }

        const newCertificate = new Certificate({ title, photo });
        await newCertificate.save();

        res.status(201).json({ message: "Certificate added successfully", newCertificate });
    } catch (error) {
        res.status(500).json({ message: "Error creating certificate", error });
    }
};

// Get all certificates
exports.getCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find();
        res.status(200).json(certificates);
    } catch (error) {
        res.status(500).json({ message: "Error fetching certificates", error });
    }
};

// Update a certificate
exports.updateCertificate = async (req, res) => {
    try {
        const { title } = req.body;
        const photo = req.file ? req.file.path : undefined;

        const updatedCertificate = await Certificate.findByIdAndUpdate(req.params.id, 
            { title, ...(photo && { photo }) }, 
            { new: true }
        );

        if (!updatedCertificate) {
            return res.status(404).json({ message: "Certificate not found" });
        }

        res.status(200).json({ message: "Certificate updated successfully", updatedCertificate });
    } catch (error) {
        res.status(500).json({ message: "Error updating certificate", error });
    }
};

// Delete a certificate
exports.deleteCertificate = async (req, res) => {
    try {
        const deletedCertificate = await Certificate.findByIdAndDelete(req.params.id);
        if (!deletedCertificate) {
            return res.status(404).json({ message: "Certificate not found" });
        }
        res.status(200).json({ message: "Certificate deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting certificate", error });
    }
};
