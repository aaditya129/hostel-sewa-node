const express = require("express");
const { registerHostel, getAllHostels, getHostelById, getAssignedHostels, assignHostelToOwner, editHostel } = require("../controllers/hostelController");
const auth = require("../middleware/authMiddleware"); // ✅ Import auth middleware

const router = express.Router();

router.post('/registerhostel', registerHostel); // ✅ Admin Only
router.get("/getallhostel",   getAllHostels); // ✅ Admin Only
router.get("/:id",  getHostelById); // ✅ Secure API
router.post("/assigned",  getAssignedHostels); // ✅ Only for owners
router.post("/assign",auth,  assignHostelToOwner); // ✅ Admins assign hostels
router.put("/edithostel/:hostelId", editHostel); 

module.exports = router;
