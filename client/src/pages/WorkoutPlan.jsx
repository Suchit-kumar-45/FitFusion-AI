import { useState } from 'react';
import { generateWorkout } from '../services/workoutService';
import '../styles/workoutplan.css';

function WorkoutPlan() {
  const [goal, setGoal] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [level, setLevel] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);

      const data = {
        goal,
        weight: parseFloat(weight),
        height: parseFloat(height),
        level,
      };

      const response = await generateWorkout(data);
      setPlan(response.workoutPlan);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate workout');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workout-plan-container">
      <div className="workout-plan-form">
        <h1>AI Workout Planner</h1>

        <form onSubmit={handleGenerate}>
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
              <option value="Endurance">Endurance</option>
              <option value="Strength">Strength</option>
              <option value="General Fitness">General Fitness</option>
            </select>
          </div>

          <div className="form-group">
            <label>Weight (kg) *</label>
            <input
              type="number"
              placeholder="Enter your weight in kg"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Height (cm) *</label>
            <input
              type="number"
              placeholder="Enter your height in cm"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Fitness Level *</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
            >
              <option value="">Select your level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="generate-btn">
            {loading ? 'Generating...' : 'Generate Workout Plan'}
          </button>
        </form>
      </div>

      {plan && (
        <div className="workout-plan-result">
          <h2>Your Personalized Workout Plan</h2>
          <div className="plan-content">
            {plan.split('\n').map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkoutPlan;