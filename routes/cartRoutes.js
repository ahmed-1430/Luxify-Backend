const express = require("express");
const { applyCoupon } = require("../controllers/cartController");

const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/", protect, updateCartItem);
router.delete("/:productId", protect, removeFromCart);
router.delete("/", protect, clearCart);
router.post("/apply-coupon", protect, applyCoupon);

module.exports = router;
