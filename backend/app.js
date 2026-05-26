const express = require("express");

const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");

const workoutRoutes = require("./src/routes/workoutRoutes");

const dietRoutes = require("./src/routes/dietRoutes");

const aiChatRoutes = require("./src/routes/aiChatRoutes");

const progressRoutes = require("./src/routes/progressRoutes");

const app = express();

// CORS Configuration - Enable CORS before other middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL || 'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use("/api/auth", authRoutes);

app.use("/api/workout", workoutRoutes);

app.use("/api/diet", dietRoutes);

app.use("/api/chat", aiChatRoutes);

app.use("/api/progress", progressRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("🔴 Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;