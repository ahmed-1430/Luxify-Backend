const express = require("express");
const {
    getAllUsers,
    toggleBlockUser,
    changeUserRole,
} = require("../controllers/adminUserController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, authorize("admin"), getAllUsers);
router.patch("/block/:id", protect, authorize("admin"), toggleBlockUser);
router.patch("/role/:id", protect, authorize("admin"), changeUserRole);

module.exports = router;
