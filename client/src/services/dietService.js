import axios from "axios";

const API =
  `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/diet`;

const getToken = () => localStorage.getItem("token");

export const generateDiet =
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