const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  generateDiet,
} = require("../controllers/dietController");

router.post("/generate", authMiddleware, generateDiet);

module.exports = router;