import axios from "axios";

const API =
  "http://localhost:8000/api/workout";

const getToken = () => localStorage.getItem("token");

export const generateWorkout =
  async (data = {}) => {
    const response = await axios.post(
      `${API}/generate`,
      data,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  };