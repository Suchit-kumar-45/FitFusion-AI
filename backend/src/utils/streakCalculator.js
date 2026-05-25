// Calculate current workout streak for a user
const calculateWorkoutStreak = async (Progress, userId) => {
  try {
    // Get all progress records sorted by date (most recent first)
    const progressRecords = await Progress.find({ user: userId })
      .sort({ date: -1 })
      .limit(365); // Look back up to a year

    if (progressRecords.length === 0) {
      return 0;
    }

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let checkDate = new Date(today);

    // Iterate through dates backwards from today
    for (let i = 0; i < 365; i++) {
      const currentDateStr = checkDate.toISOString().split('T')[0];

      // Find a progress record for this date with workoutCompleted = true
      const foundRecord = progressRecords.find(record => {
        const recordDateStr = new Date(record.date).toISOString().split('T')[0];
        return recordDateStr === currentDateStr && record.workoutCompleted;
      });

      if (foundRecord) {
        streak++;
      } else {
        // Streak breaks if no workout found
        break;
      }

      // Move to previous day
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
  } catch (error) {
    console.error('Error calculating workout streak:', error);
    return 0;
  }
};

// Get or create today's progress record for a user
const getTodayProgress = async (Progress, userId) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let todayProgress = await Progress.findOne({
      user: userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!todayProgress) {
      // Create today's progress record if it doesn't exist
      todayProgress = await Progress.create({
        user: userId,
        date: today,
        weight: 0, // Will be filled later
        waterIntake: 0,
        workoutCompleted: false
      });
    }

    return todayProgress;
  } catch (error) {
    console.error('Error getting today progress:', error);
    return null;
  }
};

module.exports = {
  calculateWorkoutStreak,
  getTodayProgress
};
