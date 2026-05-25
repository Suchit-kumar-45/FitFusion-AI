// Mifflin-St Jeor Formula for calculating BMR (Basal Metabolic Rate)
const calculateBMR = (gender, weight, height, age) => {
  let bmr;
  
  if (gender === 'Male') {
    // BMR = (10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + 5)
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (gender === 'Female') {
    // BMR = (10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) - 161)
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    // Average for Other
    bmr = (10 * weight + 6.25 * height - 5 * age - 78) / 1; // Use female formula as default
  }
  
  return Math.round(bmr);
};

// Activity multipliers
const activityMultipliers = {
  'Sedentary': 1.2,                    // Little or no exercise
  'Lightly Active': 1.375,             // Light exercise 1-3 days/week
  'Moderately Active': 1.55,           // Moderate exercise 3-5 days/week
  'Very Active': 1.725,                // Hard exercise 6-7 days/week
  'Extremely Active': 1.9              // Physical job or training twice per day
};

// Calculate TDEE (Total Daily Energy Expenditure)
const calculateTDEE = (bmr, activityLevel) => {
  const multiplier = activityMultipliers[activityLevel] || 1.55;
  return Math.round(bmr * multiplier);
};

// Calculate calorie adjustment based on goal
const adjustCaloriesForGoal = (tdee, goal) => {
  if (goal === 'Weight Loss') {
    return Math.round(tdee * 0.85); // 15% deficit
  } else if (goal === 'Muscle Gain') {
    return Math.round(tdee * 1.10); // 10% surplus
  } else if (goal === 'Maintenance') {
    return Math.round(tdee);
  } else if (goal === 'Endurance') {
    return Math.round(tdee * 1.05); // Slight surplus for endurance training
  } else if (goal === 'Flexibility') {
    return Math.round(tdee * 0.95); // Slight deficit
  }
  return Math.round(tdee);
};

// Main function to calculate daily calories
const calculateDailyCalories = (userProfile) => {
  const { gender, weight, height, age, goal, activityLevel } = userProfile;
  
  // Validate inputs
  if (!weight || !height || !age) {
    return 2000; // Default fallback
  }
  
  const bmr = calculateBMR(gender, weight, height, age);
  const tdee = calculateTDEE(bmr, activityLevel || 'Moderately Active');
  const adjustedCalories = adjustCaloriesForGoal(tdee, goal);
  
  return adjustedCalories;
};

module.exports = {
  calculateBMR,
  calculateTDEE,
  adjustCaloriesForGoal,
  calculateDailyCalories,
  activityMultipliers
};
