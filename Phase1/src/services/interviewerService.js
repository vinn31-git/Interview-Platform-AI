import axiosInstance from "./axiosConfig";

export const generateQuestions = async (data) => {
  const response = await axiosInstance.post(
    `/groq/generate-questions`,
    data
  );
  return response.data;
};

export const initInterviewer = async (interviewContext) => {
  const response = await axiosInstance.post(
    `/groq/interviewer/init`,
    { interviewContext }
  );
  return response.data;
};

export const chatWithInterviewer = async (payload) => {
  const response = await axiosInstance.post(
    `/groq/interviewer/chat`,
    payload
  );
  return response.data;
};

export const presentQuestion = async (payload) => {
  const response = await axiosInstance.post(
    `/groq/interviewer/present-question`,
    payload
  );
  return response.data;
};
