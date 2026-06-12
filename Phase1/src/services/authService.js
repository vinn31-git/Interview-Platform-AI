import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Function to login user
const loginUser = async (userData) => {
  const response = await axios.post(
    `${API_URL}/login`,
    userData
  );

  return response.data;
};

// Function to signup user
const signupUser = async (userData) => {
  const response = await axios.post(
    `${API_URL}/signup`,
    userData
  );

  return response.data;
};

export { loginUser, signupUser };