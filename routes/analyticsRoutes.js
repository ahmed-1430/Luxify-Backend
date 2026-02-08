const express = require("express");
const {
    getDashboardStats,
    getDailySales,
    getTopProducts,
    getRecentOrders,
} = require("../controllers/analyticsController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

// ADMIN ONLY
router.get("/dashboard", protect, authorize("admin"), getDashboardStats);
router.get("/daily-sales", protect, authorize("admin"), getDailySales);
router.get("/top-products", protect, authorize("admin"), getTopProducts);
router.get("/recent-orders", protect, authorize("admin"), getRecentOrders);

module.exports = router;
