import axios from "axios";
import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:5000/api/evaluation";

export const evaluateInterview = async (data) => {
  const response = await axios.post(`${API_URL}/evaluate`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
