const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now },
});

const specificationSchema = new mongoose.Schema({
    key: String,
    value: String,
});

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },

        price: { type: Number, required: true },
        discountPrice: { type: Number },

        stock: { type: Number, required: true, default: 0 },

        category: { type: String, required: true },
        brand: { type: String },

        images: {
            main: { type: String, required: true },
            gallery: [{ type: String }],
        },

        features: [{ type: String }],

        specifications: [specificationSchema],

        rating: { type: Number, default: 0 },
        reviewsCount: { type: Number, default: 0 },
        reviews: [reviewSchema],
        featured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
