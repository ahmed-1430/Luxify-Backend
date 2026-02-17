require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const webhookRoutes = require("./routes/webhookRoutes");

const authRoutes = require("./routes/authRoutes");
const googleRoutes = require("./routes/googleRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const adminProductRoutes = require("./routes/adminProductRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

app.use(express.json());
app.use(cors());

// connect database
connectDB();

// simple health check
app.get("/", (req, res) => {
    res.send("Luxify Backend Running...");
});

// routes
app.use("/api/auth", authRoutes);

app.use("/api/auth", googleRoutes);

app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/checkout", checkoutRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/admin/products", adminProductRoutes);

app.use("/api/admin/users", adminUserRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/webhooks", webhookRoutes);

// TEMPORARY: no error handler at all
const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports= app;
