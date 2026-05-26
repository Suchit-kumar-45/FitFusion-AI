import axios from "axios";

const API =
  `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/auth`;

export const registerUser = async (
  data
) => {
  if (!data.name || !data.email || !data.password) {
    throw new Error("Name, email, and password are required");
  }

  const response = await axios.post(
    `${API}/register`,
    data
  );

  return response.data;
};

export const loginUser = async (
  data
) => {
  if (!data.email || !data.password) {
    throw new Error("Email and password are required");
  }

  const response = await axios.post(
    `${API}/login`,
    data
  );

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response.data;
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${API}/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

export const updateProfile = async (data) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `${API}/profile`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (response.data.user) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response.data;
};