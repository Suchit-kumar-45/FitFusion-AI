const Progress = require("../models/Progress");
const { calculateWorkoutStreak, getTodayProgress } = require("../utils/streakCalculator");

exports.addProgress = async (req, res) => {
  try {
    const { weight, waterIntake, workoutCompleted, notes } = req.body;
    const userId = req.user?.id;

    // Validation
    if (!weight) {
      return res.status(400).json({
        message: "Weight is required",
      });
    }

    if (isNaN(weight) || weight <= 0) {
      return res.status(400).json({
        message: "Weight must be a valid number greater than 0",
      });
    }

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if today's progress already exists
    let progress = await Progress.findOne({
      user: userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (progress) {
      // Update existing record
      progress.weight = weight;
      if (waterIntake !== undefined) progress.waterIntake = waterIntake;
      if (workoutCompleted !== undefined) progress.workoutCompleted = workoutCompleted;
      if (notes) progress.notes = notes;
      await progress.save();
    } else {
      // Create new record for today
      progress = await Progress.create({
        user: userId,
        date: today,
        weight,
        waterIntake: waterIntake || 0,
        workoutCompleted: workoutCompleted || false,
        notes,
      });
    }

    // Calculate workout streak if workout was completed
    if (workoutCompleted) {
      const streak = await calculateWorkoutStreak(Progress, userId);
      progress.workoutStreak = streak;
      await progress.save();
    }

    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getTodayProgress = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    const todayProgress = await getTodayProgress(Progress, userId);
    
    if (!todayProgress) {
      return res.status(500).json({
        message: "Could not retrieve today's progress"
      });
    }

    res.json(todayProgress);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user?.id })
      .sort({ date: -1 })
      .limit(30);

    res.json(progress);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { weight, waterIntake, workoutCompleted, notes } = req.body;
    const userId = req.user?.id;

    // Validation
    if (weight && (isNaN(weight) || weight <= 0)) {
      return res.status(400).json({
        message: "Weight must be a valid number greater than 0",
      });
    }

    const progress = await Progress.findByIdAndUpdate(
      id,
      { 
        weight, 
        waterIntake,
        workoutCompleted,
        notes 
      },
      { new: true }
    );

    if (!progress) {
      return res.status(404).json({
        message: "Progress record not found",
      });
    }

    // Recalculate streak if workout status changed
    if (workoutCompleted !== undefined) {
      const streak = await calculateWorkoutStreak(Progress, userId);
      progress.workoutStreak = streak;
      await progress.save();
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.logWorkout = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    const todayProgress = await getTodayProgress(Progress, userId);
    
    if (!todayProgress) {
      return res.status(500).json({ message: "Failed to log workout" });
    }

    // Mark workout as completed
    todayProgress.workoutCompleted = true;
    
    // Calculate new streak
    const streak = await calculateWorkoutStreak(Progress, userId);
    todayProgress.workoutStreak = streak;
    
    await todayProgress.save();

    res.json({
      message: "Workout logged successfully",
      workoutStreak: todayProgress.workoutStreak,
      progress: todayProgress
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.logWaterIntake = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { amount } = req.body; // amount in liters

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        message: "Amount must be a valid number greater than 0"
      });
    }

    const todayProgress = await getTodayProgress(Progress, userId);
    
    if (!todayProgress) {
      return res.status(500).json({ message: "Failed to log water intake" });
    }

    // Add to current water intake
    todayProgress.waterIntake += parseFloat(amount);
    await todayProgress.save();

    res.json({
      message: "Water intake logged successfully",
      waterIntake: todayProgress.waterIntake,
      waterGoal: todayProgress.waterGoal,
      progress: todayProgress
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteProgress = async (req, res) => {
  try {
    const { id } = req.params;

    const progress = await Progress.findByIdAndDelete(id);

    if (!progress) {
      return res.status(404).json({
        message: "Progress record not found",
      });
    }

    res.json({ message: "Progress deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
