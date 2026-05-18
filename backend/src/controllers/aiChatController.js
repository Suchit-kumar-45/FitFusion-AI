const {
  askFitnessAI,
} = require('../services/geminiService');

exports.chatWithAI = async (req, res) => {
  try {
    const reply = await askFitnessAI(req.body.message);

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};