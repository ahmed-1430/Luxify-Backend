const Stripe = require("stripe");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// STEP 1 — Create Payment Intent
exports.createPaymentIntent = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(cart.total * 100), // Stripe uses cents
            currency: "usd",
            automatic_payment_methods: { enabled: true },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            cartTotal: cart.total,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// STEP 2 — Confirm order after successful payment
exports.confirmOrder = async (req, res) => {
    try {
        const { paymentIntentId, shippingAddress } = req.body;

        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        // Create order from cart
        const order = await Order.create({
            userId: req.user._id,
            items: cart.items,
            subtotal: cart.subtotal,
            shipping: cart.shipping,
            tax: cart.tax,
            discount: cart.discount,
            total: cart.total,
            paymentIntentId,
            paymentStatus: "succeeded",
            shippingAddress,
        });

        // Reduce stock for each product
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity },
            });
        }

        // Clear cart after order
        await Cart.findOneAndUpdate(
            { userId: req.user._id },
            { items: [], subtotal: 0, shipping: 0, tax: 0, discount: 0, total: 0 }
        );

        res.status(201).json({
            message: "Order placed successfully",
            order,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
