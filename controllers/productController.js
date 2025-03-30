const mongoose = require('mongoose');
const Product = require('../models/Product');

// @desc    Add a new product
// @route   POST /api/products
// @access  Public (or Private if only admins can add products)
const addProduct = async (req, res) => {
    try {
        const { name, price, rating, details, features, category } = req.body;
        const photo = req.file?.path; // ✅ Cloudinary-hosted image URL

        const newProduct = new Product({
            name,
            photo,
            price,
            rating,
            details,
            features,
            category,
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({
            success: true,
            data: savedProduct,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};


// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

const toggleAvailability = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Toggle the availability
        product.available = !product.available;

        // Save the updated product
        const updatedProduct = await product.save();

        res.status(200).json({
            success: true,
            message: 'Product availability toggled successfully',
            data: updatedProduct,
        });
    } catch (error) {
        console.error('Error toggling availability:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

// @desc    Edit an existing product
// @route   PUT /api/products/:id
// @access  Public (or Private if only admins can edit products)
const editProduct = async (req, res) => {
    try {
        const { name, photo, price, rating, details, features, category } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                photo,
                price,
                rating,
                details,
                features,
                category,
            },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            data: updatedProduct,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

// @desc    Add a review to a product
// @route   POST /api/products/:id/reviews
// @access  Public (or Private if only authenticated users can leave reviews)
const addReview = async (req, res) => {
    try {
        const { user, rating, comment } = req.body;

        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID',
            });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        const review = {
            user: new mongoose.Types.ObjectId(user),
            rating: Number(rating),
            comment,
        };

        product.reviews.push(review);
        await product.save();

        res.status(201).json({
            success: true,
            message: 'Review added',
        });
    } catch (error) {
        console.error('Error adding review:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Edit a review
// @route   PUT /api/products/:productId/reviews/:reviewId
// @access  Public
const editReview = async (req, res) => {
    try {
        const { productId, reviewId } = req.params;
        const { user, rating, comment } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        const review = product.reviews.id(reviewId);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        if (review.user.toString() !== user) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to edit this review',
            });
        }

        if (rating) review.rating = rating;
        if (comment) review.comment = comment;

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            data: product,
        });
    } catch (error) {
        console.error('Error editing review:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

module.exports = {
    addProduct,
    getProductById,
    editProduct,
    addReview,
    editReview,
    getAllProducts,
    toggleAvailability,
    deleteProduct
};
