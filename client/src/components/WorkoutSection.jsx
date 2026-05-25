import { useState } from "react";

import { generateWorkout } from "../services/workoutService";

import "../styles/sections.css";

function WorkoutSection() {
  const [workout, setWorkout] =
    useState("");

  const handleWorkout = async () => {
    const data = {
      goal: "Muscle Gain",
      weight: 72,
      height: 175,
      level: "Intermediate",
    };

    const response =
      await generateWorkout(data);

    setWorkout(response.workoutPlan);
  };

  return (
    <div className="section-card">
      <h2>AI Workout Generator</h2>

      <button onClick={handleWorkout}>
        Generate Workout
      </button>

      <p>{workout}</p>
    </div>
  );
}

export default WorkoutSection;