import axiosInstance from "./axiosConfig";

export const startInterview = async (data) => {
  const response = await axiosInstance.post(`/interviews/start`, data);
  return response.data;
};

export const saveInterviewResults = async (id, data) => {
  const response = await axiosInstance.put(`/interviews/${id}/results`, data);
  return response.data;
};

export const getInterviewHistory = async () => {
  const response = await axiosInstance.get(`/interviews/history`);
  return response.data;
};

export const getInterviewById = async (id) => {
  const response = await axiosInstance.get(`/interviews/${id}`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await axiosInstance.get(`/interviews/stats`);
  return response.data;
};
