const express = require("express");

const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");

const workoutRoutes = require("./src/routes/workoutRoutes");

const dietRoutes = require("./src/routes/dietRoutes");

const aiChatRoutes = require("./src/routes/aiChatRoutes");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use("/api/auth", authRoutes);

app.use("/api/workout", workoutRoutes);

app.use("/api/diet", dietRoutes);

app.use("/api/chat", aiChatRoutes);

module.exports = app;