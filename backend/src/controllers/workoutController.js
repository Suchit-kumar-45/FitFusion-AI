const Workout = require('../models/Workout');

const {
  generateWorkoutPlan,
} = require('../services/geminiService');

exports.createWorkout = async (req, res) => {
  try {
    const workout = await generateWorkoutPlan(req.body);

    const savedWorkout = await Workout.create({
      userId: req.body.userId,
      workoutPlan: workout,
    });

    res.status(200).json(savedWorkout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};