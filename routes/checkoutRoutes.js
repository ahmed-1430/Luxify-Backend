const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createPaymentIntent, confirmOrder } = require("../controllers/checkoutController");

const router = express.Router();

router.post("/create-payment-intent", protect, createPaymentIntent);
router.post("/confirm-order", protect, confirmOrder);

module.exports = router;
