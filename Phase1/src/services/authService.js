import axiosInstance from "./axiosConfig";

export const loginUser = async (userData) => {
  const response = await axiosInstance.post(`/auth/login`, userData);
  return response.data;
};

export const signupUser = async (userData) => {
  const response = await axiosInstance.post(`/auth/signup`, userData);
  return response.data;
};

export const verifyToken = async () => {
  const response = await axiosInstance.get(`/auth/verify`);
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await axiosInstance.put(`/auth/profile`, profileData);
  return response.data;
};
