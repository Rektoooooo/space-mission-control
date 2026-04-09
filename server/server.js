require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const missionRoutes = require("./routes/missions");
const crewMemberRoutes = require("./routes/crewMembers");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/missions", missionRoutes);
app.use("/api/crew-members", crewMemberRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Space Mission Control API is running" });
});

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
