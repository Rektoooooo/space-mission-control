require("dotenv").config({ path: ".env" });
// dotenv only loads from .env file (local dev). On Render, env vars come from the dashboard.
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const missionRoutes = require("./routes/missions");
const crewMemberRoutes = require("./routes/crewMembers");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Routes
app.use("/api/missions", missionRoutes);
app.use("/api/crew-members", crewMemberRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Space Mission Control API is running" });
});

// Connect to DB, seed if empty, and start server
const seed = require("./seed");

connectDB().then(async () => {
  await seed();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
