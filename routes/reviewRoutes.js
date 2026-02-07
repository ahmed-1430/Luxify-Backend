const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { addReview } = require("../controllers/reviewController");

const router = express.Router();

// POST a review for a product
router.post("/:productId", protect, addReview);

module.exports = router;
