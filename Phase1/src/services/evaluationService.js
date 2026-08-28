import axiosInstance from "./axiosConfig";

export const evaluateInterview = async (data) => {
  const response = await axiosInstance.post(`/evaluation/evaluate`, data);
  return response.data;
};
