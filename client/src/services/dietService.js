import axios from 'axios';

export const generateDiet = async (data) => {
  const response = await axios.post(
    'http://localhost:5000/api/diet/generate',
    data
  );

  return response.data;
};