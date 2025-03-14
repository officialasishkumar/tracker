require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const contestRoutes = require("./routes/contest.routes");
const userRoutes = require("./routes/user.routes");
const { initCronJobs } = require("./services/cronJobs");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/user", userRoutes);

// Initialize Cron Jobs (fetch contests & YouTube solutions every 14 hours)
initCronJobs();

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
