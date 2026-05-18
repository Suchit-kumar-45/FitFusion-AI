const mongoose = require('mongoose');

const dietSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    dietPlan: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Diet', dietSchema);