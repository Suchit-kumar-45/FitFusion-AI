// Water intake requirement calculator based on multiple factors

const activityWaterMultiplier = {
  'Sedentary': 30,                    // 30ml per kg
  'Lightly Active': 35,               // 35ml per kg
  'Moderately Active': 40,            // 40ml per kg
  'Very Active': 45,                  // 45ml per kg
  'Extremely Active': 50              // 50ml per kg
};

const seasonAdjustments = {
  'Summer': 1.15,      // +15% (more sweating, higher heat)
  'Spring': 1.0,       // baseline
  'Rainy': 1.05,       // +5% (some increased activity)
  'Winter': 0.90       // -10% (less sweating, but still crucial)
};

const genderAdjustments = {
  'Male': 1.0,         // baseline
  'Female': 0.95,      // 5% less (generally)
  'Other': 1.0         // baseline
};

// Calculate personalized daily water goal
const calculateWaterGoal = (userProfile) => {
  const { weight, age, gender, activityLevel, season } = userProfile;

  // Validate inputs
  if (!weight || weight <= 0) {
    return 3.5; // Default fallback
  }

  // Step 1: Base calculation (ml per kg of body weight)
  const baseMultiplier = activityWaterMultiplier[activityLevel] || 40;
  let waterIntakeML = weight * baseMultiplier;

  // Step 2: Apply gender adjustment
  const genderMultiplier = genderAdjustments[gender] || 1.0;
  waterIntakeML *= genderMultiplier;

  // Step 3: Age-based adjustment (older people need more water)
  let ageMultiplier = 1.0;
  if (age) {
    if (age < 18) {
      ageMultiplier = 0.85; // Younger need slightly less
    } else if (age > 65) {
      ageMultiplier = 1.1; // Older need slightly more
    }
  }
  waterIntakeML *= ageMultiplier;

  // Step 4: Apply season adjustment
  const seasonMultiplier = seasonAdjustments[season] || 1.0;
  waterIntakeML *= seasonMultiplier;

  // Convert to liters and round
  let waterIntakeLiters = (waterIntakeML / 1000).toFixed(1);
  waterIntakeLiters = parseFloat(waterIntakeLiters);

  // Ensure it stays within safe limits (2L - 6L per day)
  waterIntakeLiters = Math.max(2, Math.min(waterIntakeLiters, 6));

  return waterIntakeLiters;
};

// Get water goal with detailed breakdown
const getWaterGoalWithBreakdown = (userProfile) => {
  const { weight, age, gender, activityLevel, season } = userProfile;

  const baseMultiplier = activityWaterMultiplier[activityLevel] || 40;
  const baseWater = (weight * baseMultiplier / 1000).toFixed(1);

  const genderMultiplier = genderAdjustments[gender] || 1.0;
  const seasonMultiplier = seasonAdjustments[season] || 1.0;

  const finalGoal = calculateWaterGoal(userProfile);

  return {
    baseGoal: parseFloat(baseWater),
    adjustedGoal: finalGoal,
    breakdownFactors: {
      weight: `${weight}kg × ${baseMultiplier}ml/kg`,
      gender: `${(genderMultiplier * 100).toFixed(0)}% adjustment (${gender})`,
      season: `${(seasonMultiplier * 100).toFixed(0)}% adjustment (${season})`,
      activityLevel: activityLevel
    },
    minLimit: 2,
    maxLimit: 6,
    recommendedIntakeTimes: getWaterIntakeTiming(finalGoal)
  };
};

// Suggest water intake timing throughout the day
const getWaterIntakeTiming = (dailyGoal) => {
  const portionSize = (dailyGoal / 8).toFixed(2); // Divide into 8 portions

  return [
    { time: '7:00 AM (Morning)', amount: portionSize, note: 'After waking up, before breakfast' },
    { time: '10:00 AM', amount: portionSize, note: 'Mid-morning break' },
    { time: '1:00 PM (Lunch)', amount: portionSize, note: 'Before/during lunch' },
    { time: '3:00 PM', amount: portionSize, note: 'Afternoon break' },
    { time: '5:00 PM (Pre-Workout)', amount: portionSize, note: 'Before exercise' },
    { time: '6:30 PM (Post-Workout)', amount: portionSize, note: 'After exercise' },
    { time: '8:00 PM (Dinner)', amount: portionSize, note: 'With dinner' },
    { time: '9:00 PM', amount: portionSize, note: 'Before sleep (don\'t overdo it)' }
  ];
};

// Get hydration status
const getHydrationStatus = (currentIntake, goal) => {
  const percentage = (currentIntake / goal) * 100;

  if (percentage < 25) return { status: 'Dehydrated', emoji: '❌', color: '#ef4444' };
  if (percentage < 50) return { status: 'Low', emoji: '⚠️', color: '#f59e0b' };
  if (percentage < 75) return { status: 'Moderate', emoji: '🔶', color: '#f97316' };
  if (percentage < 100) return { status: 'Good', emoji: '✅', color: '#22c55e' };
  if (percentage <= 125) return { status: 'Excellent', emoji: '💧', color: '#0ea5e9' };
  return { status: 'Over-hydrated', emoji: '⚠️', color: '#a855f7' };
};

// Generate hydration recommendation
const getHydrationRecommendation = (userProfile, currentIntake, goal) => {
  const status = getHydrationStatus(currentIntake, goal);
  let recommendation = '';

  if (userProfile.season === 'Summer') {
    recommendation = 'Summer heat increases water loss through sweating. Drink more frequently and carry water with you.';
  } else if (userProfile.season === 'Winter') {
    recommendation = 'Winter air is dry and you may not feel as thirsty. Set reminders to drink regularly as dehydration is common in cold weather.';
  } else if (userProfile.season === 'Rainy') {
    recommendation = 'Maintain steady hydration throughout the day, even if humidity is high.';
  }

  if (userProfile.activityLevel === 'Extremely Active' || userProfile.activityLevel === 'Very Active') {
    recommendation += ' Your high activity level requires consistent hydration - drink water before, during, and after workouts.';
  }

  return recommendation;
};

module.exports = {
  calculateWaterGoal,
  getWaterGoalWithBreakdown,
  getWaterIntakeTiming,
  getHydrationStatus,
  getHydrationRecommendation,
  activityWaterMultiplier,
  seasonAdjustments
};
