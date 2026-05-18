const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    workoutPlan: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Workout', workoutSchema);