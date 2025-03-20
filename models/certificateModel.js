const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    photo: {
        type: String,  // Store the file path or URL
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', CertificateSchema);
