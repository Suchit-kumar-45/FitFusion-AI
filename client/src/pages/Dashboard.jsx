import "../styles/dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">FitFusion AI</h2>

        <ul className="menu">
          <li>Dashboard</li>
          <li>Workout Plan</li>
          <li>Diet Plan</li>
          <li>Progress</li>
          <li>AI Coach</li>
        </ul>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Welcome Back 👋</h1>
          <p>Track your fitness journey with AI insights</p>
        </div>

        <div className="cards-container">
          <div className="dashboard-card">
            <h3>BMI</h3>
            <p>22.4</p>
          </div>

          <div className="dashboard-card">
            <h3>Calories</h3>
            <p>2150 kcal</p>
          </div>

          <div className="dashboard-card">
            <h3>Workout Streak</h3>
            <p>8 Days</p>
          </div>

          <div className="dashboard-card">
            <h3>Weight</h3>
            <p>72 KG</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;