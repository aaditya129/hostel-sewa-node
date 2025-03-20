const Inquiry = require('../models/Inquiry');

// @route   POST /api/inquiries
// @desc    Create a new inquiry
// @access  Public
exports.createInquiry = async (req, res) => {
  const { fullName, address, emailAddress, mobileNumber, hostelType, seaterDescription } = req.body;

  // Validate required fields
  if (!fullName || !emailAddress || !mobileNumber || !hostelType || !seaterDescription) {
    return res.status(400).json({ msg: 'Please fill in all required fields' });
  }

  try {
    // Create a new inquiry
    const newInquiry = new Inquiry({
      fullName,
      address,
      emailAddress,
      mobileNumber,
      hostelType,
      seaterDescription
    });

    // Save inquiry to the database
    await newInquiry.save();

    res.status(201).json({ msg: 'Inquiry submitted successfully', inquiry: newInquiry });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllInquiries = async (req, res) => {
    try {
      const inquiries = await Inquiry.find();
      res.status(200).json(inquiries);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

  exports.updateInquiryStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    if (!['pending', 'completed'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }
  
    try {
      const inquiry = await Inquiry.findById(id);
  
      if (!inquiry) {
        return res.status(404).json({ msg: 'Inquiry not found' });
      }
  
      // Update the inquiry status
      inquiry.status = status;
      await inquiry.save();
  
      res.status(200).json({ msg: 'Inquiry status updated', inquiry });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };