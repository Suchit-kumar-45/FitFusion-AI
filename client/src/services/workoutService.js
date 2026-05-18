import axios from 'axios';

export const generateWorkout = async (data) => {
  const response = await axios.post(
    'http://localhost:5000/api/workout/generate',
    data
  );

  return response.data;
};