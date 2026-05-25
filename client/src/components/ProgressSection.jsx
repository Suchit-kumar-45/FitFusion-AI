import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/sections.css";

function ProgressSection() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    workoutCompleted: false,
    workoutStreak: 0,
    waterIntake: 0,
    waterGoal: 3.5
  });
  const [loading, setLoading] = useState(true);

  // Fetch today's progress
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/auth/dashboard-stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.stats) {
          setStats({
            workoutCompleted: data.stats.workoutCompleted || false,
            workoutStreak: data.stats.workoutStreak || 0,
            waterIntake: data.stats.waterIntake || 0,
            waterGoal: data.stats.waterGoal || 3.5
          });
        }
      } catch (error) {
        console.error('Failed to fetch progress stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  // Log workout
  const handleLogWorkout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/progress/log-workout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.workoutStreak !== undefined) {
        setStats(prev => ({
          ...prev,
          workoutCompleted: true,
          workoutStreak: data.workoutStreak
        }));
      }
    } catch (error) {
      console.error('Failed to log workout:', error);
    }
  };

  // Log water intake
  const handleAddWater = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/progress/log-water', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: 0.25 }) // Log 250ml = 0.25 liters
      });
      const data = await response.json();
      if (data.waterIntake !== undefined) {
        setStats(prev => ({
          ...prev,
          waterIntake: data.waterIntake
        }));
      }
    } catch (error) {
      console.error('Failed to log water intake:', error);
    }
  };

  const waterPercentage = loading ? 0 : (stats.waterIntake / stats.waterGoal) * 100;
  const workoutPercentage = stats.workoutCompleted ? 100 : 0;

  return (
    <div className="section-card">
      <h2>Today's Progress</h2>

      <div className="progress-box">
        <div className="progress-header">
          <p>Workout Completion</p>
          <span className="streak-badge">{stats.workoutStreak} Day Streak 🔥</span>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{width: `${workoutPercentage}%`}}></div>
        </div>
        <p className="progress-text">{stats.workoutCompleted ? '✅ Completed' : 'Not completed'}</p>
        
        <button 
          className="btn btn-log"
          onClick={handleLogWorkout}
          disabled={stats.workoutCompleted || loading}
        >
          {stats.workoutCompleted ? 'Workout Done ✅' : 'Log Workout'}
        </button>
      </div>

      <div className="water-box">
        <div className="water-header">
          <h3>Water Intake</h3>
          <span className="water-target">{stats.waterGoal}L Goal</span>
        </div>

        <p className="water-intake">{loading ? 'Loading...' : `${stats.waterIntake.toFixed(2)} / ${stats.waterGoal} Liters`}</p>
        
        <div className="progress-bar">
          <div className="progress-fill water-fill" style={{width: `${Math.min(waterPercentage, 100)}%`}}></div>
        </div>

        <button 
          className="btn btn-log btn-water"
          onClick={handleAddWater}
          disabled={loading}
        >
          + Add 250ml
        </button>
      </div>
    </div>
  );
}

export default ProgressSection;