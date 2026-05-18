const express = require('express');

const router = express.Router();

const {
  createWorkout,
} = require('../controllers/workoutController');

router.post('/generate', createWorkout);

module.exports = router;