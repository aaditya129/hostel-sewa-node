const express = require('express');
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const {
  addProduct,
  getProductById,
  editProduct,
  addReview,
  editReview,
  getAllProducts,
  toggleAvailability,
  deleteProduct,
} = require("../controllers/productController");

// ✅ Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) => `product-${Date.now()}-${file.originalname.split('.')[0]}`
  },
});

const upload = multer({ storage });

// ✅ Routes
router.post('/', upload.single('photo'), addProduct); // Use Cloudinary for product photo
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', editProduct);
router.post('/:id/reviews', addReview);
router.put('/products/:productId/reviews/:reviewId', editReview);
router.put('/:id/toggle-availability', toggleAvailability);
router.delete('/:id', deleteProduct);

module.exports = router;
