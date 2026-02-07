const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    price: Number,
    image: String,
    quantity: Number,
});

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        items: [orderItemSchema],

        subtotal: Number,
        shipping: Number,
        tax: Number,
        discount: Number,
        total: Number,

        paymentIntentId: String,
        paymentStatus: {
            type: String,
            enum: ["pending", "succeeded", "failed"],
            default: "pending",
        },

        shippingAddress: {
            name: String,
            phone: String,
            address: String,
            city: String,
            country: String,
            zip: String,
        },

        orderStatus: {
            type: String,
            enum: ["processing", "shipped", "delivered"],
            default: "processing",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
