import { useState } from "react";
import { generateDiet } from "../services/dietService";

function DietPlan() {
  const [goal, setGoal] = useState("");
  const [dietType, setDietType] = useState("");
  const [calories, setCalories] = useState("");
  const [dietPlan, setDietPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateDiet = async () => {
    try {
      setLoading(true);

      const data = {
        goal,
        dietType,
        calories,
      };

      const response = await generateDiet(data);

      setDietPlan(response.dietPlan || response.diet);
    } catch (error) {
      console.log(error);
      alert("Failed to generate diet plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1>AI Diet Planner</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Enter Goal (Fat Loss / Muscle Gain)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          style={{
            padding: "12px",
            fontSize: "16px",
          }}
        />

        <input
          type="text"
          placeholder="Diet Type (Veg / Non-Veg)"
          value={dietType}
          onChange={(e) => setDietType(e.target.value)}
          style={{
            padding: "12px",
            fontSize: "16px",
          }}
        />

        <input
          type="number"
          placeholder="Daily Calories"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          style={{
            padding: "12px",
            fontSize: "16px",
          }}
        />

        <button
          onClick={handleGenerateDiet}
          style={{
            padding: "12px",
            backgroundColor: "black",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {loading ? "Generating..." : "Generate Diet Plan"}
        </button>
      </div>

      {dietPlan && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            whiteSpace: "pre-wrap",
          }}
        >
          <h2>Your AI Diet Plan</h2>

          <p>{dietPlan}</p>
        </div>
      )}
    </div>
  );
}

export default DietPlan;