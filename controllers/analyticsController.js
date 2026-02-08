const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// ===== DASHBOARD OVERVIEW =====
exports.getDashboardStats = async (req, res) => {
    try {
        const totalRevenue = await Order.aggregate([
            { $match: { paymentStatus: "succeeded" } },
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);

        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        const pendingOrders = await Order.countDocuments({
            orderStatus: "processing",
        });

        res.json({
            totalRevenue: totalRevenue[0]?.total || 0,
            totalOrders,
            totalUsers,
            totalProducts,
            pendingOrders,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ===== DAILY SALES (Last 7 days) =====
exports.getDailySales = async (req, res) => {
    try {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        const sales = await Order.aggregate([
            { $match: { createdAt: { $gte: last7Days } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalSales: { $sum: "$total" },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ===== TOP SELLING PRODUCTS =====
exports.getTopProducts = async (req, res) => {
    try {
        const topProducts = await Order.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productId",
                    totalSold: { $sum: "$items.quantity" },
                    revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                },
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            {
                $project: {
                    productId: "$_id",
                    name: "$product.name",
                    image: "$product.images.main",
                    totalSold: 1,
                    revenue: 1,
                },
            },
        ]);

        res.json(topProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ===== RECENT ORDERS (for dashboard table) =====
exports.getRecentOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "name email")
            .sort({ createdAt: -1 })
            .limit(10);

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
