const Diet = require("../models/Diet");
const User = require("../models/User");

const {
  generateGeminiResponse,
  generatePersonalizedDiet,
} = require("../services/geminiService");

exports.generateDiet =
  async (req, res) => {
    try {
      const userId = req.user.id;
      const {
        goal,
        calories,
        dietType,
      } = req.body;

      // Fetch user data
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Use user's goal if not provided in request
      const userGoal = goal || user.goal || "Fitness";
      const userCalories = calories || 2000;
      const userDietType = dietType || "Balanced";

      const prompt = `
      Create a detailed, personalized diet plan based on the following user profile:

      User Profile:
      - Name: ${user.name}
      - Age: ${user.age || 'Not specified'} years
      - Gender: ${user.gender || 'Not specified'}
      - Weight: ${user.weight || 'Not specified'} kg
      - Height: ${user.height || 'Not specified'} cm
      - Fitness Goal: ${userGoal}

      Diet Plan Requirements:
      - Total Daily Calories: ${userCalories} kcal
      - Diet Type: ${userDietType}

      Please provide:
      1. Breakfast (with calories)
      2. Mid-morning snack (with calories)
      3. Lunch (with calories)
      4. Evening snack (with calories)
      5. Dinner (with calories)
      6. Total daily nutrition breakdown
      7. Tips specific to their goal (${userGoal})
      8. Gender-specific nutritional considerations

      Make sure the total calories add up to approximately ${userCalories} kcal.
      Provide specific food items and portion sizes.
      Consider their gender (${user.gender}) for hormonal and metabolic factors.
    `;

      let dietPlan;
      try {
        dietPlan = await generateGeminiResponse(prompt);
      } catch (apiError) {
        console.log("Using personalized fallback for diet");
        dietPlan = generatePersonalizedDiet({
          name: user.name,
          age: user.age,
          gender: user.gender,
          weight: user.weight,
          height: user.height,
          goal: userGoal,
          calories: userCalories
        });
      }

      const diet = await Diet.create({
        user: userId,
        goal: userGoal,
        dietPlan,
      });

      res.json(diet);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };