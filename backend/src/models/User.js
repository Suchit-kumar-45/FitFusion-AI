const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  age: Number,
  height: Number,
  weight: Number,
  goal: String,
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Male'
  },
  dailyCalories: {
    type: Number,
    default: 2000
  },
  activityLevel: {
    type: String,
    enum: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extremely Active'],
    default: 'Moderately Active'
  },
  waterGoal: {
    type: Number,
    default: 3.5, // liters
    min: 2,
    max: 6
  },
  season: {
    type: String,
    enum: ['Summer', 'Winter', 'Rainy', 'Spring'],
    default: 'Spring'
  },
  location: {
    type: String,
    default: 'Unknown' // for climate-based recommendations
  }
});

module.exports = mongoose.model('User', userSchema);