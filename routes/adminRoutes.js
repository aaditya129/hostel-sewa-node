const express = require("express");
const { registerAdmin, loginAdmin, getAdminDetails } = require("../controllers/adminAuthController");
const auth = require("../middleware/authMiddleware"); // Middleware to protect routes
const router = express.Router();

// ✅ Admin Registration (Only for Initial Setup)
router.post("/register", registerAdmin);

// ✅ Admin Login
router.post("/login", loginAdmin);

// ✅ Get Admin Details (Protected)
router.get("/details", auth, getAdminDetails);

module.exports = router;
