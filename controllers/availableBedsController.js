const AvailableBeds = require("../models/AvailableBeds");
const Hostel = require("../models/Hostel"); 

const getHostelsByRoomType = async (req, res) => {
  try {
    const { roomType } = req.body; // 🔄 from body now

    if (!roomType) {
      return res.status(400).json({ success: false, message: "roomType is required in body" });
    }

    const beds = await AvailableBeds.find({
      roomType,
      bedsAvailable: { $gt: 0 }
    }).populate("hostelId");

    const hostels = beds.map(bed => bed.hostelId);

    res.status(200).json({ success: true, count: hostels.length, data: hostels });
  } catch (error) {
    console.error("Error fetching hostels by room type:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Add Available Beds
const addAvailableBeds = async (req, res) => {
  try {
    const { hostelId, roomType, perBedPrice, bedsAvailable } = req.body;

    if (!hostelId || !roomType || !perBedPrice || bedsAvailable === undefined) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newBeds = new AvailableBeds({ hostelId, roomType, perBedPrice, bedsAvailable });
    const savedBeds = await newBeds.save();

    res.status(201).json({ success: true, data: savedBeds });
  } catch (error) {
    console.error("Error adding available beds:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get Available Beds by Hostel ID
const getAvailableBedsByHostel = async (req, res) => {
  try {
    const { hostelId } = req.params;

    if (!hostelId) {
      return res.status(400).json({ success: false, message: "Hostel ID is required" });
    }

    const beds = await AvailableBeds.find({ hostelId });

    if (!beds.length) {
      return res.status(404).json({ success: false, message: "No available beds found for this hostel" });
    }

    res.status(200).json({ success: true, data: beds });
  } catch (error) {
    console.error("Error fetching available beds:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Update Available Beds (Batch Update for Multiple Room Types)
const updateAvailableBeds = async (req, res) => {
    try {
      const { hostelId, roomType, bedsAvailable, perBedPrice } = req.body;
  
      const updatedBeds = await AvailableBeds.findOneAndUpdate(
        { hostelId, roomType }, // Find based on hostelId & roomType
        { bedsAvailable, perBedPrice }, // Update fields
        { new: true, runValidators: true }
      );
  
      if (!updatedBeds) {
        return res.status(404).json({
          success: false,
          message: "Beds not found for the specified room type in this hostel",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Beds updated successfully",
        data: updatedBeds,
      });
    } catch (error) {
      console.error("Error updating available beds:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };

// ✅ Delete Available Beds by Bed ID
const deleteAvailableBeds = async (req, res) => {
  try {
    const { bedId } = req.params;

    if (!bedId) {
      return res.status(400).json({ success: false, message: "Bed ID is required" });
    }

    const deletedBeds = await AvailableBeds.findByIdAndDelete(bedId);

    if (!deletedBeds) {
      return res.status(404).json({ success: false, message: "Beds not found" });
    }

    res.status(200).json({ success: true, message: "Available beds deleted successfully" });
  } catch (error) {
    console.error("Error deleting available beds:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  addAvailableBeds,
  getAvailableBedsByHostel,
  updateAvailableBeds,
  deleteAvailableBeds,
  getHostelsByRoomType
};
