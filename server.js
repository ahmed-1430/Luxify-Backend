require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const googleRoutes = require("./routes/googleRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(express.json());
app.use(cors());

// connect database
connectDB();

// simple health check
app.get("/", (req, res) => {
  res.send("Luxify Backend Running...");
});

// auth routes
app.use("/api/auth", authRoutes);

app.use("/api/auth", googleRoutes);

app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);

// TEMPORARY: no error handler at all
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
