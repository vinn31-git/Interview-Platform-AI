import axiosInstance from "./axiosConfig";

export const generateQuestions = async (data) => {
  const response = await axiosInstance.post(
    `/groq/generate-questions`,
    data
  );

  return response.data;
};