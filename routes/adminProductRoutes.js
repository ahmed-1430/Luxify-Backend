const express = require("express");
const {
    createProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured,
} = require("../controllers/adminProductController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorize("admin"), createProduct);
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);
router.patch("/featured/:id", protect, authorize("admin"), toggleFeatured);

module.exports = router;
