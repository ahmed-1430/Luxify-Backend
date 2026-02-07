const Product = require("../models/Product");

exports.addReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if user already reviewed
        const alreadyReviewed = product.reviews.find(
            (rev) => rev.userId.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({
                message: "You have already reviewed this product",
            });
        }

        // Create new review
        const review = {
            userId: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        };

        product.reviews.push(review);
        product.reviewsCount = product.reviews.length;

        // Calculate new average rating
        const total = product.reviews.reduce(
            (sum, rev) => sum + rev.rating,
            0
        );
        product.rating = total / product.reviews.length;

        await product.save();

        res.status(201).json({
            message: "Review added successfully",
            rating: product.rating,
            reviewsCount: product.reviewsCount,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
