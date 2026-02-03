require("dotenv").config();

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chats");

const app = express();

/* ---------- Middleware ---------- */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // restrict in prod
  })
);
app.use(express.json());

/* ---------- Database ---------- */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

/* ---------- Routes ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);

/* ---------- Health Check ---------- */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/* ---------- Server ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
