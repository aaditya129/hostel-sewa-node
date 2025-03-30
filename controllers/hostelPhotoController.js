const HostelPhoto = require("../models/HostelPhoto");

/**
 * Upload cover photo
 */
exports.uploadCoverPhoto = async (req, res) => {
    try {
        const { hostelId } = req.params;
        const imageUrl = req.file?.path; // ✅ Cloudinary URL

        let hostelPhoto = await HostelPhoto.findOne({ hostelId });

        if (!hostelPhoto) {
            hostelPhoto = new HostelPhoto({ hostelId, coverPhoto: imageUrl });
        } else {
            hostelPhoto.coverPhoto = imageUrl;
        }

        await hostelPhoto.save();
        res.json({ message: "Cover photo updated successfully", data: hostelPhoto });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get all photos for a hostel
 */
exports.getHostelPhotos = async (req, res) => {
    try {
        const { hostelId } = req.params;

        const hostelPhoto = await HostelPhoto.findOne({ hostelId });

        if (!hostelPhoto) {
            return res.status(404).json({ message: "No photos found for this hostel." });
        }

        res.json({
            coverPhoto: hostelPhoto.coverPhoto,
            photos: hostelPhoto.photos
        });
    } catch (error) {
        console.error("❌ Error fetching hostel photos:", error);
        res.status(500).json({ error: "Server error while fetching photos." });
    }
};

/**
 * Upload multiple hostel photos
 */
exports.uploadPhotos = async (req, res) => {
    try {
        const { hostelId } = req.params;
        const imageUrls = req.files.map(file => file.path); // ✅ Cloudinary URLs

        let hostelPhoto = await HostelPhoto.findOne({ hostelId });

        if (!hostelPhoto) {
            hostelPhoto = new HostelPhoto({ hostelId, photos: imageUrls });
        } else {
            hostelPhoto.photos.push(...imageUrls);
        }

        await hostelPhoto.save();
        res.json({ message: "Photos added successfully", data: hostelPhoto });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Delete cover photo
 */
exports.deleteCoverPhoto = async (req, res) => {
    try {
        const { hostelId } = req.params;
        let hostelPhoto = await HostelPhoto.findOne({ hostelId });

        if (!hostelPhoto) return res.status(404).json({ message: "No photos found" });

        hostelPhoto.coverPhoto = null;
        await hostelPhoto.save();

        res.json({ message: "Cover photo deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Delete a specific hostel photo
 */
exports.deletePhoto = async (req, res) => {
    try {
        const { hostelId } = req.params;
        const { imageUrl } = req.body; // Cloudinary URL in request body

        let hostelPhoto = await HostelPhoto.findOne({ hostelId });

        if (!hostelPhoto) return res.status(404).json({ message: "No photos found" });

        hostelPhoto.photos = hostelPhoto.photos.filter(photo => photo !== imageUrl);
        await hostelPhoto.save();

        res.json({ message: "Photo deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
