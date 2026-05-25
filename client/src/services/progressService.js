import axios from "axios";

const API = "http://localhost:8000/api/progress";

const getToken = () => localStorage.getItem("token");

export const addProgress = async (data) => {
  if (!data.weight) {
    throw new Error("Weight is required");
  }

  const response = await axios.post(`${API}/add`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const getProgress = async () => {
  const response = await axios.get(`${API}/my`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const updateProgress = async (id, data) => {
  const response = await axios.put(`${API}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const deleteProgress = async (id) => {
  const response = await axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};
