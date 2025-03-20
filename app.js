const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();

// Connect Database
connectDB();

// CORS Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow multiple origins
    credentials: true, // If you're using cookies or HTTP authentication
  })
);

// Init Middleware
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file names
  },
});
const upload = multer({ storage });

// Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
const blogRoutes = require("./routes/blogRoutes");
const hostelPhotoRoutes = require("./routes/hostelPhotoRoutes"); // ✅ Import fixed
const contactRoutes = require('./routes/contactRoutes');
const certificateRoutes = require('./routes/certificateRoutes');  
// Define Routes
app.use('/api/auth', require('./routes/authRoutes')); 
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/hostel', require('./routes/hostelRoutes'));
app.use('/api/available-beds', require('./routes/availableBedsRoutes'));
app.use("/api/admin", require("./routes/adminRoutes")); 
app.use("/api/hostel-photos", hostelPhotoRoutes); // ✅ Now works correctly
app.use("/api/blogs", blogRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/certificates', certificateRoutes);

// Example Endpoint with Multer for Testing
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
    res.status(200).json({ msg: 'File uploaded successfully', file });
  } catch (err) {
    console.error('Error during file upload:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
