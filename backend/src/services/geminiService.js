const genAI = require('../config/geminiConfig');

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

const generateWorkoutPlan = async (data) => {
  const prompt = `
  Generate a 7-day workout plan.

  Goal: ${data.goal}
  Weight: ${data.weight}
  Height: ${data.height}
  Fitness Level: ${data.level}
  `;

  const result = await model.generateContent(prompt);

  return result.response.text();
};
const generateDietPlan = async (data) => {
  const prompt = `
  Generate a healthy diet plan.

  Goal: ${data.goal}
  Diet Type: ${data.dietType}
  Calories: ${data.calories}
  `;

  const result = await model.generateContent(prompt);

  return result.response.text();
};

const askFitnessAI = async (message) => {
  const result = await model.generateContent(message);

  return result.response.text();
};

module.exports = {
  generateWorkoutPlan,
  generateDietPlan,
  askFitnessAI,
};