const User = require("../models/User");
const {
  generateGeminiResponse,
  generatePersonalizedAIResponse,
} = require("../services/geminiService");

exports.askAI = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    // Validation
    if (!message || message.trim() === "") {
      return res.status(400).json({
        message: "Message cannot be empty",
      });
    }

    // Fetch user profile for personalized context
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate BMI
    const heightInMeters = user.height ? user.height / 100 : 1.75;
    const bmi = user.weight && user.height
      ? (user.weight / (heightInMeters * heightInMeters)).toFixed(1)
      : 'Not calculated';

    const prompt = `
      You are a professional AI fitness coach with expertise in personalized fitness guidance.

      User Profile:
      - Name: ${user.name}
      - Age: ${user.age || 'Not specified'} years
      - Gender: ${user.gender || 'Not specified'}
      - Weight: ${user.weight || 'Not specified'} kg
      - Height: ${user.height || 'Not specified'} cm
      - BMI: ${bmi}
      - Fitness Goal: ${user.goal || 'Not specified'}

      User Question:
      ${message}

      Please provide personalized advice based on their profile and fitness goal (${user.goal || 'General Fitness'}).
      Consider their current stats (Gender: ${user.gender || 'Unknown'}, Age: ${user.age || 'Unknown'}, BMI: ${bmi}, Goal: ${user.goal || 'Not set'}) when giving recommendations.
      Include gender-specific fitness and health considerations.
      Be encouraging and provide actionable tips.
    `;

    let reply;
    try {
      reply = await generateGeminiResponse(prompt);
    } catch (apiError) {
      console.log("Using personalized fallback for AI response");
      reply = generatePersonalizedAIResponse(
        {
          name: user.name,
          age: user.age,
          gender: user.gender,
          weight: user.weight,
          height: user.height,
          goal: user.goal
        },
        message
      );
    }

    res.json({ reply });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};