import { useState } from "react";

import { generateDiet } from "../services/dietService";

import "../styles/sections.css";

function DietSection() {
  const [diet, setDiet] = useState("");

  const handleDiet = async () => {
    const data = {
      goal: "Fat Loss",
      dietType: "Vegetarian",
      calories: 2200,
    };

    const response = await generateDiet(
      data
    );

    setDiet(response.dietPlan);
  };

  return (
    <div className="section-card">
      <h2>AI Diet Planner</h2>

      <button onClick={handleDiet}>
        Generate Diet
      </button>

      <p>{diet}</p>
    </div>
  );
}

export default DietSection;