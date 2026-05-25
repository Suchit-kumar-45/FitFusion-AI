import { useContext, useMemo, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import WorkoutSection from "../components/WorkoutSection";
import DietSection from "../components/DietSection";
import AIChatSection from "../components/AIChatSection";
import ProgressSection from "../components/ProgressSection";

import "../styles/dashboard.css";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    dailyCalories: 2000,
    workoutStreak: 0
  });
  const [loading, setLoading] = useState(true);

  // Calculate BMI
  const bmi = useMemo(() => {
    if (user?.height && user?.weight) {
      const heightInMeters = user.height / 100;
      const bmiValue = (user.weight / (heightInMeters * heightInMeters)).toFixed(1);
      return bmiValue;
    }
    return "N/A";
  }, [user?.height, user?.weight]);

  // Fetch dashboard stats
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
            dailyCalories: data.stats.dailyCalories || 2000,
            workoutStreak: data.stats.workoutStreak || 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        // Fallback to default values
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <Navbar />

        <div className="stats-grid">
          <StatsCard title="BMI" value={bmi !== "N/A" ? bmi : "Not set"} />

          <StatsCard
            title="Calories"
            value={loading ? "Loading..." : `${stats.dailyCalories} kcal`}
          />

          <StatsCard
            title="Weight"
            value={user?.weight ? `${user.weight} KG` : "Not set"}
          />

          <StatsCard
            title="Workout Streak"
            value={loading ? "Loading..." : `${stats.workoutStreak} Days`}
          />
        </div>

        <div className="dashboard-sections">
          <WorkoutSection />

          <DietSection />
        </div>

        <ProgressSection />

        <AIChatSection />
      </div>
      </div>
  );
}

export default Dashboard;