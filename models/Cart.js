const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    price: Number,
    image: String,
    quantity: { type: Number, required: true, min: 1 },
});

const cartSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        items: [cartItemSchema],

        subtotal: { type: Number, default: 0 },
        shipping: { type: Number, default: 0 },      
        tax: { type: Number, default: 0 },           // <-- tax (10%)
        discount: { type: Number, default: 0 },      // <-- promo code
        total: { type: Number, default: 0 },         // <-- grand total
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
