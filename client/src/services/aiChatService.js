import axios from "axios";

const API =
  `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/chat`;

const getToken = () => localStorage.getItem("token");

export const askAI = async (
  message
) => {
  if (!message || message.trim() === "") {
    throw new Error("Message cannot be empty");
  }

  const response = await axios.post(
    `${API}/ask`,
    {
      message,
    },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};