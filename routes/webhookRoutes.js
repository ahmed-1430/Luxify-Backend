const express = require("express");
const { handleStripeWebhook } = require("../controllers/webhookController");

const router = express.Router();

// IMPORTANT: Stripe requires RAW body (NOT express.json)
router.post(
    "/stripe",
    express.raw({ type: "application/json" }),
    handleStripeWebhook
);

module.exports = router;
