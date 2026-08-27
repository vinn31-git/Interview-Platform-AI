import axios from "axios";
import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:5000/api/interviews";

export const startInterview = async (data) => {
  const response = await axios.post(
    `${API_URL}/start`,
    data,
    { headers: getAuthHeaders() }
  );

  return response.data;
};

export const saveInterviewResults = async (id, data) => {
  const response = await axios.put(
    `${API_URL}/${id}/results`,
    data,
    { headers: getAuthHeaders() }
  );

  return response.data;
};

export const getInterviewHistory = async () => {
  const response = await axios.get(
    `${API_URL}/history`,
    { headers: getAuthHeaders() }
  );

  return response.data;
};

export const getInterviewById = async (id) => {
  const response = await axios.get(
    `${API_URL}/${id}`,
    { headers: getAuthHeaders() }
  );

  return response.data;
};

export const getDashboardStats = async () => {
  const response = await axios.get(
    `${API_URL}/stats`,
    { headers: getAuthHeaders() }
  );

  return response.data;
};
