const User = require('../models/User');
const Progress = require('../models/Progress');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { calculateDailyCalories } = require('../utils/calorieCalculator');
const { calculateWorkoutStreak } = require('../utils/streakCalculator');
const { calculateWaterGoal, getWaterGoalWithBreakdown } = require('../utils/waterCalculator');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        height: user.height,
        weight: user.weight,
        age: user.age,
        goal: user.goal,
        gender: user.gender,
        dailyCalories: user.dailyCalories,
        activityLevel: user.activityLevel,
        waterGoal: user.waterGoal,
        season: user.season,
        location: user.location,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        height: user.height,
        weight: user.weight,
        age: user.age,
        goal: user.goal,
        gender: user.gender,
        dailyCalories: user.dailyCalories,
        activityLevel: user.activityLevel,
        waterGoal: user.waterGoal,
        season: user.season,
        location: user.location,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, height, weight, age, goal, gender, activityLevel, season, location } = req.body;

    // Fetch current user to prepare update
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare update object
    const updateData = {
      name: name || user.name,
      height: height || user.height,
      weight: weight || user.weight,
      age: age || user.age,
      goal: goal || user.goal,
      gender: gender || user.gender,
      activityLevel: activityLevel || user.activityLevel,
      season: season || user.season,
      location: location || user.location
    };

    // Calculate daily calories if any metric changed
    if (height || weight || age || goal || gender || activityLevel) {
      updateData.dailyCalories = calculateDailyCalories({
        gender: updateData.gender,
        weight: updateData.weight,
        height: updateData.height,
        age: updateData.age,
        goal: updateData.goal,
        activityLevel: updateData.activityLevel
      });
    }

    // Calculate water goal based on weight, activity, season, and gender
    if (weight || gender || activityLevel || season) {
      updateData.waterGoal = calculateWaterGoal({
        weight: updateData.weight,
        age: updateData.age,
        gender: updateData.gender,
        activityLevel: updateData.activityLevel,
        season: updateData.season
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        height: updatedUser.height,
        weight: updatedUser.weight,
        age: updatedUser.age,
        goal: updatedUser.goal,
        gender: updatedUser.gender,
        dailyCalories: updatedUser.dailyCalories,
        activityLevel: updatedUser.activityLevel,
        waterGoal: updatedUser.waterGoal,
        season: updatedUser.season,
        location: updatedUser.location
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's progress
    const todayProgress = await Progress.findOne({
      user: userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    }).select('workoutStreak waterIntake waterGoal workoutCompleted weight');

    // Calculate current workout streak
    const currentStreak = await calculateWorkoutStreak(Progress, userId);

    res.json({
      stats: {
        dailyCalories: user.dailyCalories || 2000,
        activityLevel: user.activityLevel || 'Moderately Active',
        workoutStreak: currentStreak,
        workoutCompleted: todayProgress?.workoutCompleted || false,
        waterIntake: todayProgress?.waterIntake || 0,
        waterGoal: user.waterGoal || 3.5,
        currentWeight: todayProgress?.weight || user.weight
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWaterGoalInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const waterInfo = getWaterGoalWithBreakdown({
      weight: user.weight,
      age: user.age,
      gender: user.gender,
      activityLevel: user.activityLevel,
      season: user.season
    });

    const { getHydrationRecommendation } = require('../utils/waterCalculator');
    
    // Get today's water intake
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayProgress = await Progress.findOne({
      user: userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    const currentIntake = todayProgress?.waterIntake || 0;
    const goal = user.waterGoal;

    res.json({
      waterGoal: {
        dailyTarget: goal,
        minLimit: waterInfo.minLimit,
        maxLimit: waterInfo.maxLimit,
        currentIntake: currentIntake,
        percentageComplete: ((currentIntake / goal) * 100).toFixed(1),
        remaining: (goal - currentIntake).toFixed(2)
      },
      breakdown: waterInfo.breakdownFactors,
      hydrationTiming: waterInfo.recommendedIntakeTimes,
      season: user.season,
      activityLevel: user.activityLevel,
      recommendation: getHydrationRecommendation(
        { season: user.season, activityLevel: user.activityLevel },
        currentIntake,
        goal
      )
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};