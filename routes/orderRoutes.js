const express = require("express");
const {
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

// ===== USER ROUTES =====
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

// ===== ADMIN ROUTES =====
router.get("/admin/all", protect, authorize("admin"), getAllOrders);
router.put(
    "/admin/status/:id",
    protect,
    authorize("admin"),
    updateOrderStatus
);

module.exports = router;
