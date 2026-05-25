const Workout = require("../models/Workout");
const User = require("../models/User");

const {
  generateGeminiResponse,
  generatePersonalizedWorkout,
} = require("../services/geminiService");

exports.generateWorkout =
  async (req, res) => {
    try {
      const userId = req.user.id;
      const {
        goal,
        weight,
        height,
        level,
      } = req.body;

      // Fetch user data
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Use user's data with request body as fallback
      const userGoal = goal || user.goal || "General Fitness";
      const userWeight = weight || user.weight || 70;
      const userHeight = height || user.height || 170;
      const userLevel = level || "Beginner";

      // Calculate BMI
      const heightInMeters = userHeight / 100;
      const bmi = (userWeight / (heightInMeters * heightInMeters)).toFixed(1);

      const prompt = `
      Create a comprehensive, personalized gym workout plan based on the following user profile:

      User Profile:
      - Name: ${user.name}
      - Age: ${user.age || 'Not specified'} years
      - Gender: ${user.gender || 'Not specified'}
      - Weight: ${userWeight} kg
      - Height: ${userHeight} cm
      - BMI: ${bmi}
      - Fitness Goal: ${userGoal}
      - Experience Level: ${userLevel}

      Please provide:
      1. A 7-day workout split tailored to their goal (${userGoal})
      2. For each day:
         - Specific exercises with sets and reps
         - Rest periods
         - Difficulty level
      3. Warm-up and cool-down routines
      4. Nutrition tips specific to their goal
      5. Progress tracking recommendations
      6. Modifications for their fitness level (${userLevel})
      7. Important safety precautions
      8. Gender-specific considerations for optimal results

      Make sure the workout is appropriate for someone with BMI of ${bmi} and their ${userLevel} level.
      Focus on achieving their goal: ${userGoal}
      Consider their gender (${user.gender}) for body composition and hormonal factors.
    `;

      let workoutPlan;
      try {
        workoutPlan = await generateGeminiResponse(prompt);
      } catch (apiError) {
        console.log("Using personalized fallback for workout");
        workoutPlan = generatePersonalizedWorkout({
          name: user.name,
          age: user.age,
          gender: user.gender,
          weight: userWeight,
          height: userHeight,
          goal: userGoal,
          level: userLevel
        });
      }

      const workout =
        await Workout.create({
          user: userId,
          goal: userGoal,
          workoutPlan,
        });

      res.json(workout);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };