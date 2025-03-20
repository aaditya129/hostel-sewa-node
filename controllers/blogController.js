const Blog = require("../models/Blog");

/**
 * Create a new blog
 */
exports.createBlog = async (req, res) => {
    try {
        const { title, heading, author, content } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        if (!title || !heading || !author || !content || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newBlog = new Blog({ title, heading, image, author, content });
        await newBlog.save();
        res.status(201).json({ message: "Blog created successfully", blog: newBlog });
    } catch (error) {
        res.status(500).json({ message: "Error creating blog", error: error.message });
    }
};

/**
 * Get all blogs
 */
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }); // Latest blogs first
        res.json({ blogs });
    } catch (error) {
        res.status(500).json({ message: "Error fetching blogs", error: error.message });
    }
};

/**
 * Get a single blog by ID
 */
exports.getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.json({ blog });
    } catch (error) {
        res.status(500).json({ message: "Error fetching blog", error: error.message });
    }
};

/**
 * Update an existing blog
 */
exports.updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, heading, author, content } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : undefined;

        const updatedData = { title, heading, author, content };
        if (image) updatedData.image = image;

        const updatedBlog = await Blog.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.json({ message: "Blog updated successfully", blog: updatedBlog });
    } catch (error) {
        res.status(500).json({ message: "Error updating blog", error: error.message });
    }
};

/**
 * Delete a blog
 */
exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting blog", error: error.message });
    }
};
