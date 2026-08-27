import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

export const signupUser = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  return response.data;
};

export const verifyToken = async () => {
  const response = await axios.get(`${API_URL}/verify`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await axios.put(`${API_URL}/profile`, profileData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export { getAuthHeaders };
