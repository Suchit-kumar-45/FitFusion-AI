const mongoose = require("mongoose");

const dietSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    goal: String,

    dietPlan: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Diet",
  dietSchema
);