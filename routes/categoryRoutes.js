const express = require("express");

const router = express.Router();

const categories = [
    "Mobiles",
    "Laptops",
    "Home Appliances",
    "Outdoor",
    "Tools",
    "Gadgets",
    "Accessories",
];

router.get("/", (req, res) => {
    res.json(categories);
});

module.exports = router;
