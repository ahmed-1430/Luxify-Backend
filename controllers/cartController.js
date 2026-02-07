const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Recalculate all totals
const calculateTotals = (items) => {
    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const shipping = subtotal >= 50 ? 0 : 5; // FREE over $50
    const tax = subtotal * 0.10; // 10% tax
    const discount = 0; // promo code discount

    const total = subtotal + shipping + tax - discount;

    return { subtotal, shipping, tax, discount, total };
};

const applyPromoDiscount = (code, subtotal) => {
    let discount = 0;

    if (code === "WELCOME15") {
        discount = subtotal * 0.15; // 15% off
    } else if (code === "SAVE10") {
        discount = subtotal * 0.10; // 10% off
    } else if (code === "FREESHIP") {
        // We'll handle free shipping separately
        return { discount: 0, freeShipping: true };
    } else {
        return { discount: 0, invalid: true };
    }

    return { discount, freeShipping: false };
};


// GET cart of logged-in user
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                userId: req.user._id,
                items: [],
                subtotal: 0,
                shipping: 0,
                tax: 0,
                discount: 0,
                total: 0,
            });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ADD item to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product)
            return res.status(404).json({ message: "Product not found" });

        if (product.stock < quantity) {
            return res.status(400).json({ message: "Not enough stock" });
        }

        let cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            cart = new Cart({
                userId: req.user._id,
                items: [],
            });
        }

        const existingItem = cart.items.find(
            (item) => item.productId.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                productId,
                name: product.name,
                price: product.discountPrice || product.price,
                image: product.images.main,
                quantity,
            });
        }

        //  Correct totals assignment
        const totals = calculateTotals(cart.items);

        cart.subtotal = totals.subtotal;
        cart.shipping = totals.shipping;
        cart.tax = totals.tax;
        cart.discount = totals.discount;
        cart.total = totals.total;

        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE quantity
exports.updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find(
            (item) => item.productId.toString() === productId
        );

        if (!item)
            return res.status(404).json({ message: "Item not in cart" });

        item.quantity = quantity;

        const totals = calculateTotals(cart.items);

        cart.subtotal = totals.subtotal;
        cart.shipping = totals.shipping;
        cart.tax = totals.tax;
        cart.discount = totals.discount;
        cart.total = totals.total;

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// REMOVE item
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(
            (item) => item.productId.toString() !== productId
        );

        const totals = calculateTotals(cart.items);

        cart.subtotal = totals.subtotal;
        cart.shipping = totals.shipping;
        cart.tax = totals.tax;
        cart.discount = totals.discount;
        cart.total = totals.total;

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CLEAR cart
exports.clearCart = async (req, res) => {
    try {
        await Cart.findOneAndUpdate(
            { userId: req.user._id },
            {
                items: [],
                subtotal: 0,
                shipping: 0,
                tax: 0,
                discount: 0,
                total: 0,
            }
        );

        res.json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.applyCoupon = async (req, res) => {
    try {
        const { code } = req.body;

        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const subtotal = cart.subtotal;

        const result = applyPromoDiscount(code, subtotal);

        if (result.invalid) {
            return res.status(400).json({ message: "Invalid promo code" });
        }

        // Recalculate totals
        const shipping =
            result.freeShipping || subtotal >= 50 ? 0 : 5;

        const tax = subtotal * 0.10;
        const discount = result.discount;
        const total = subtotal + shipping + tax - discount;

        cart.shipping = shipping;
        cart.tax = tax;
        cart.discount = discount;
        cart.total = total;

        await cart.save();

        res.json({
            message: "Promo applied",
            cart,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
