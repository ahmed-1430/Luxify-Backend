const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

// Get current logged-in user
router.get("/me", protect, (req, res) => {
    res.json(req.user);
});

// Admin-only  route
router.get("/admin-only", protect, authorize("admin"), (req, res) => {
    res.json({ message: "Welcome Admin" });
});

module.exports = router;
