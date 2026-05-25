const mongoose = require("mongoose");

const workoutSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      goal: String,

      workoutPlan: String,
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Workout",
  workoutSchema
);