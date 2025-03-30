const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} = require("../controllers/blogController");

const router = express.Router();

// ✅ Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blogs",
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`,
  },
});

const upload = multer({ storage });

// ✅ Routes
router.post("/", upload.single("image"), createBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/:id", upload.single("image"), updateBlog);
router.delete("/:id", deleteBlog);

module.exports = router;
