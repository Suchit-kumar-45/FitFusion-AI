import { useState } from "react";
import { generateDiet } from "../services/dietService";
import "../styles/dietplan.css";

function DietPlan() {
  const [goal, setGoal] = useState("");
  const [dietType, setDietType] = useState("");
  const [calories, setCalories] = useState("");
  const [dietPlan, setDietPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateDiet = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const data = {
        goal,
        dietType,
        calories: parseFloat(calories),
      };

      const response = await generateDiet(data);

      setDietPlan(response.dietPlan);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to generate diet plan");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="diet-plan-container">
      <div className="diet-plan-form">
        <h1>AI Diet Planner</h1>

        <form onSubmit={handleGenerateDiet}>
          <div className="form-group">
            <label>Fitness Goal *</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
            >
              <option value="">Select your goal</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Fat Loss">Fat Loss</option>
              <option value="Weight Maintenance">Weight Maintenance</option>
              <option value="Bulking">Bulking</option>
              <option value="Cutting">Cutting</option>
            </select>
          </div>

          <div className="form-group">
            <label>Diet Type *</label>
            <select
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              required
            >
              <option value="">Select diet type</option>
              <option value="Veg">Vegetarian</option>
              <option value="Non-Veg">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Keto">Keto</option>
              <option value="High-Protein">High-Protein</option>
            </select>
          </div>

          <div className="form-group">
            <label>Daily Calories *</label>
            <input
              type="number"
              placeholder="Enter daily calorie intake"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
              min="0"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="generate-btn">
            {loading ? "Generating..." : "Generate Diet Plan"}
          </button>
        </form>
      </div>

      {dietPlan && (
        <div className="diet-plan-result">
          <h2>Your Personalized Diet Plan</h2>
          <div className="plan-content">
            {dietPlan.split('\n').map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DietPlan;