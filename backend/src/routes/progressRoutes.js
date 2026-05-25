const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addProgress,
  getTodayProgress,
  getProgress,
  updateProgress,
  deleteProgress,
  logWorkout,
  logWaterIntake,
} = require("../controllers/progressController");

router.post("/add", authMiddleware, addProgress);
router.get("/today", authMiddleware, getTodayProgress);
router.get("/my", authMiddleware, getProgress);
router.put("/:id", authMiddleware, updateProgress);
router.delete("/:id", authMiddleware, deleteProgress);

// Quick log endpoints
router.post("/log-workout", authMiddleware, logWorkout);
router.post("/log-water", authMiddleware, logWaterIntake);

module.exports = router;
