const Diet = require('../models/Diet');

const {
  generateDietPlan,
} = require('../services/geminiService');

exports.createDiet = async (req, res) => {
  try {
    const diet = await generateDietPlan(req.body);

    const savedDiet = await Diet.create({
      userId: req.body.userId,
      dietPlan: diet,
    });

    res.status(200).json(savedDiet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};