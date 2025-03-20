const Contact = require('../models/Contact');

// @route   POST /api/contacts
// @desc    Submit a new contact inquiry
// @access  Public
exports.createContact = async (req, res) => {
    console.log("Received Request Data:", req.body); // Debug log to check incoming data
  
    const { name, email, mobileNumber, messageTitle, message } = req.body;
  
    // Check if any required fields are missing
    if (!name || !email || !mobileNumber || !messageTitle || !message) {
      console.log("Missing Fields Detected"); // Debug log
      return res.status(400).json({ msg: 'Please fill in all required fields' });
    }
  
    try {
      // Create new contact
      const newContact = new Contact({
        name,
        email,
        mobileNumber,
        messageTitle,
        message,
      });
  
      // Save to database
      await newContact.save();
      console.log("Contact Saved Successfully:", newContact); // Debug log
  
      res.status(201).json({ msg: 'Contact inquiry submitted successfully', contact: newContact });
    } catch (err) {
      console.error("Database Error:", err.message);
      res.status(500).json({ msg: 'Server Error', error: err.message });
    }
  };
  

// @route   GET /api/contacts
// @desc    Get all contact inquiries
// @access  Public
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
