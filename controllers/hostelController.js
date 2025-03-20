const Hostel = require("../models/Hostel");
const HostelOwner = require("../models/owneruser");

const registerHostel = async (req, res) => {
  try {
    const {
      name, contact, address, district, province, area, mapUrl, price, totalRooms, bathrooms,
      floors, beds, students, overview, features, type,
    } = req.body;

    // Validate hostel type
    const allowedTypes = ["Boys", "Girls", "Co-ed"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid hostel type" });
    }

    const newHostel = new Hostel({
      name, contact, address, district, province, area, mapUrl, price, totalRooms, bathrooms,
      floors, beds, students, overview, features, type,
    });

    const savedHostel = await newHostel.save();
    res.status(201).json({ message: "Hostel registered successfully", data: savedHostel });
  } catch (error) {
    res.status(400).json({ message: "Error registering hostel", error: error.message });
  }
};

// ✅ Edit hostel details (including new fields)
const editHostel = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const updateData = req.body;

    // Validate hostel type if provided
    if (updateData.type) {
      const allowedTypes = ["Boys", "Girls", "Co-ed"];
      if (!allowedTypes.includes(updateData.type)) {
        return res.status(400).json({ message: "Invalid hostel type" });
      }
    }

    // 🔹 Find and update hostel
    const updatedHostel = await Hostel.findByIdAndUpdate(hostelId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedHostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    res.status(200).json({ message: "Hostel updated successfully", data: updatedHostel });
  } catch (error) {
    console.error("Error in editHostel:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all hostels (for Admins)
const getAllHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find().populate("owner", "fullName email");
    res.status(200).json({ message: "Hostels retrieved successfully", hostels });
  } catch (error) {
    res.status(500).json({ message: "Error fetching hostels", error: error.message });
  }
};

// ✅ Get a single hostel by ID
const getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id).populate("owner", "fullName email");

    if (!hostel) {
      return res.status(404).json({ success: false, message: "Hostel not found" });
    }

    res.status(200).json({ success: true, hostel });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get only the hostels assigned to the logged-in owner
const getAssignedHostels = async (req, res) => {
  try {
    const { ownerId } = req.body;

    if (!ownerId) {
      return res.status(400).json({ message: "Owner ID is required" });
    }

    const hostels = await Hostel.find({ owner: ownerId });

    if (hostels.length === 0) {
      return res.status(404).json({ message: "No hostels assigned to this owner" });
    }

    res.status(200).json({ success: true, hostels });
  } catch (error) {
    console.error("Error in getAssignedHostels:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Assign a hostel to a hostel owner
const assignHostelToOwner = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can assign hostels" });
    }

    const { ownerId, hostelId } = req.body;

    const owner = await HostelOwner.findById(ownerId);
    if (!owner) return res.status(404).json({ message: "Hostel owner not found" });

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ message: "Hostel not found" });

    hostel.owner = ownerId;
    await hostel.save();

    res.status(200).json({ message: "Hostel assigned successfully", data: hostel });
  } catch (error) {
    console.error("Error in assignHostelToOwner:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerHostel,
  getAllHostels,
  getHostelById,
  getAssignedHostels,
  assignHostelToOwner,
  editHostel,
};
