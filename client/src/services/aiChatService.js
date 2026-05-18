import axios from 'axios';

export const askAI = async (message) => {
  const response = await axios.post(
    'http://localhost:5000/api/chat',
    {
      message,
    }
  );

  return response.data;
};