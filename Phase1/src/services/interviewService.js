import axios from "axios";

const API_URL = "http://localhost:5000/api/groq";

export const generateQuestions = async (data) => {
  const response = await axios.post(
    `${API_URL}/generate-questions`,
    data
  );

  return response.data;
};