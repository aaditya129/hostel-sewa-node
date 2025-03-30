const User = require('../models/User');
const HostelOwner= require('../models/owneruser');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Generate a random 6-digit verification code
const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000);

exports.register = async (req, res) => {
  try {
    console.log("Received Registration Request:", req.body);
    console.log("Uploaded File:", req.file);

    const {
      fullName,
      email,
      password,
      confirmPassword,
      dateOfBirth,
      mobileNumber,
      address,
      gender,
      type,
    } = req.body;

    if (!fullName || !email || !password || !confirmPassword || !dateOfBirth || !mobileNumber || !address || !gender || !type) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match." });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ msg: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // Code expires in 10 minutes

    user = new User({
      fullName,
      email: email.toLowerCase(), // Ensure email is stored in lowercase
      password: hashedPassword,
      dateOfBirth,
      mobileNumber,
      address,
      profilePicture: req.file ? req.file.path : null,
      gender,
      type,
      verificationCode,
      verificationExpires,
      isVerified: false,
    });

    await user.save();

    // Send verification email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification Code",
      text: `Your verification code is ${verificationCode}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    console.log("Verification Email Sent:", email, "Code:", verificationCode);

    res.status(201).json({
      msg: "Verification code sent to email",
      email: user.email, // ✅ Ensure the email is returned in the response
    });

  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ msg: "Server error." });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    console.log("Received Verification Request for:", email);
    
    // Ensure email is in lowercase (for case-insensitive search)
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ msg: "User already verified" });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ msg: "Invalid verification code" });
    }

    if (new Date() > user.verificationExpires) {
      return res.status(400).json({ msg: "Verification code expired" });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationExpires = null;

    await user.save();

    res.json({ msg: "Email verified successfully" });

  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};



// Get User Details by _id
exports.getUserDetails = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ msg: 'User ID is required' });
    }

    const user = await User.findById(id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords for security
    res.status(200).json({ users });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token , user });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.registerOwner = async (req, res) => {
  const {
    fullName,
    district,
    address,
    addressDetails,
    mobileNumber,
    contactNumber,
    faxNumber,
    email,
    hostelType,
    ownerDetail,
    ownerContactNumber,
    registrationNumber,
    panNumber,
    locationName,
    minimumRate,
    maximumRate,
    description,
    hostelOverview,
  } = req.body;

  try {
    // Check if the owner already exists
    let owner = await HostelOwner.findOne({ email });
    if (owner) {
      return res.status(400).json({ msg: "Owner already exists" });
    }

    // Create a new owner instance
    owner = new HostelOwner({
      fullName,
      district,
      address,
      addressDetails,
      mobileNumber,
      contactNumber,
      faxNumber,
      email,
      hostelType,
      ownerDetail,
      ownerContactNumber,
      registrationNumber,
      panNumber,
      locationName,
      minimumRate,
      maximumRate,
      hostelLogo: req.files?.hostelLogo?.[0]?.path || null,
      hostelPanPhoto: req.files?.hostelPanPhoto?.[0]?.path || null,
      hostelRegistrationPhoto: req.files?.hostelRegistrationPhoto?.[0]?.path || null,
      description,
      hostelOverview,
    });

    // Default password (from schema) or set manually here
    const salt = await bcrypt.genSalt(10);
    owner.password = await bcrypt.hash("12345", salt);

    await owner.save();

    // Generate token
    const payload = {
      owner: {
        id: owner.id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
      if (err) throw err;
      res.json({ token, owner });
    });
  } catch (err) {
    console.error("Register Owner Error:", err.message);
    res.status(500).send("Server error");
  }
};


// Owner Login
exports.loginOwner = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🔹 Check if owner exists
    const owner = await HostelOwner.findOne({ email });
    if (!owner) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔹 Compare password
    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔹 Ensure role is assigned (fallback to "owner" if missing)
    const role = owner.role || "owner";

    // 🔹 Standardized token payload (matches admin format)
    const payload = {
      user: {
        id: owner.id,
        role: role
      }
    };

    console.log("Generated Token Payload:", payload); // ✅ Debugging log

    // 🔹 Generate JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) {
          console.error("JWT Error:", err);
          return res.status(500).json({ message: "Error generating token" });
        }
        
        // 🔹 Convert Mongoose document to plain object before modifying
        const ownerData = owner.toObject();
        ownerData.role = role; // Ensure role is included in response

        res.json({ token, user: ownerData });
      }
    );
  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};



exports.getAllHostelOwners = async (req, res) => {
  try {
    const owners = await HostelOwner.find().select("-password");
    res.status(200).json({ owners });
  } catch (err) {
    console.error("Error fetching owners:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.approveHostelOwner = async (req, res) => {
  try {
    const { id } = req.params;

    const owner = await HostelOwner.findById(id);
    if (!owner) {
      return res.status(404).json({ msg: "Hostel owner not found" });
    }

    owner.approved = true;
    await owner.save();

    res.status(200).json({ msg: "Hostel owner approved successfully", owner });
  } catch (err) {
    console.error("Approve error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
