import { useState } from 'react';
import { generateWorkout } from '../services/workoutService';

function WorkoutPlan() {
  const [plan, setPlan] = useState('');

  const handleGenerate = async () => {
    const data = {
      goal: 'Muscle Gain',
      weight: 70,
      height: 175,
      level: 'Beginner',
    };

    const response = await generateWorkout(data);

    setPlan(response.workoutPlan);
  };

  return (
    <div>
      <button onClick={handleGenerate}>
        Generate Workout
      </button>

      <p>{plan}</p>
    </div>
    );
}

export default WorkoutPlan;