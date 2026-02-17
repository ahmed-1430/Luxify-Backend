const Stripe = require("stripe");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            webhookSecret
        );
    } catch (err) {
        console.error("Webhook signature failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;

            const userId = paymentIntent.metadata.userId;

            try {
                const cart = await Cart.findOne({ userId });

                if (!cart || cart.items.length === 0) {
                    return res.json({ received: true });
                }

                // Create order automatically
                const order = await Order.create({
                    userId,
                    items: cart.items,
                    subtotal: cart.subtotal,
                    shipping: cart.shipping,
                    tax: cart.tax,
                    discount: cart.discount,
                    total: cart.total,
                    paymentIntentId: paymentIntent.id,
                    paymentStatus: "succeeded",
                    orderStatus: "processing",
                });

                // Reduce product stock
                for (const item of cart.items) {
                    await Product.findByIdAndUpdate(item.productId, {
                        $inc: { stock: -item.quantity },
                    });
                }

                // Clear cart
                await Cart.findOneAndUpdate(
                    { userId },
                    {
                        items: [],
                        subtotal: 0,
                        shipping: 0,
                        tax: 0,
                        discount: 0,
                        total: 0,
                    }
                );

                console.log("Order created via webhook:", order._id);
            } catch (error) {
                console.error("Webhook processing error:", error);
            }

            break;
        }

        case "payment_intent.payment_failed":
            console.log("Payment failed:", event.data.object.id);
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
};
