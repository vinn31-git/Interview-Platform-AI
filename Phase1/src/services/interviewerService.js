import axios from "axios";

const API_URL = "http://localhost:5000/api/groq";

export const generateQuestions = async (data) => {
  const response = await axios.post(
    `${API_URL}/generate-questions`,
    data
  );
  return response.data;
};

export const initInterviewer = async (interviewContext) => {
  const response = await axios.post(
    `${API_URL}/interviewer/init`,
    { interviewContext }
  );
  return response.data;
};

export const chatWithInterviewer = async (payload) => {
  const response = await axios.post(
    `${API_URL}/interviewer/chat`,
    payload
  );
  return response.data;
};

export const presentQuestion = async (payload) => {
  const response = await axios.post(
    `${API_URL}/interviewer/present-question`,
    payload
  );
  return response.data;
};
