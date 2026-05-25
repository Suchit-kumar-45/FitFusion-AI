const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: () => {
        // Set to start of today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
      },
      index: true // Index for faster queries
    },
    weight: {
      type: Number,
      required: true,
    },
    workoutStreak: {
      type: Number,
      default: 0,
    },
    workoutCompleted: {
      type: Boolean,
      default: false,
    },
    waterIntake: {
      type: Number,
      default: 0, // in liters
    },
    waterGoal: {
      type: Number,
      default: 3.5, // liters per day
    },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', progressSchema);
