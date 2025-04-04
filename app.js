const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./config/cloudinary');
const qrRoutes = require("./routes/qrRoutes");
const introArrayRoutes = require('./routes/introArrayRoutes.js');
const adImageRoutes = require("./routes/adImageRoutes");
const serviceRoutes = require('./routes/serviceRoutes');
const commitmentRoutes = require('./routes/commitmentRoutes');
const missionRoutes = require('./routes/missionRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const contactInfoRoutes = require('./routes/contactInfoRoutes');

dotenv.config();

const app = express();

// Connect Database
connectDB();

// CORS Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000',
      'https://hostelsewa.netlify.app' , 'https://hostelsewaadmin.netlify.app' ], // Allow multiple origins
    credentials: true, // If you're using cookies or HTTP authentication
  })
);

app.options('*', cors());

// Init Middleware
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

// Multer Configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Optional: your folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
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
app.use("/api/qr", qrRoutes);
app.use('/api/intro-array', introArrayRoutes);
app.use("/api", adImageRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/commitments', commitmentRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/contact-info', contactInfoRoutes);


// Example Endpoint with Multer for Testing
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
    res.status(200).json({ 
      msg: 'File uploaded successfully', 
      url: file.path  // ✅ Cloudinary URL
    });
  } catch (err) {
    console.error('Error during file upload:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});


// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
