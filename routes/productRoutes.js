const express = require('express');
const {
    addProduct,
    getProductById,
    editProduct,
    addReview,
    editReview,
    getAllProducts,
    toggleAvailability,
    deleteProduct
} = require('../controllers/productController');

const router = express.Router();

router.post('/', addProduct); // Add a new product
router.get('/', getAllProducts); // Add a new product
router.get('/:id', getProductById); // Get product by ID
router.put('/:id', editProduct); // Edit a product by ID
router.post('/:id/reviews', addReview); // Add a review to a product
router.put('/products/:productId/reviews/:reviewId', editReview);
router.put('/:id/toggle-availability', toggleAvailability); //
router.delete('/:id', deleteProduct); 

module.exports = router;
