import axios from "axios";

const API_URL = "http://localhost:5000/api/judge0";

export const runCode = async (
  sourceCode,
  languageId,
  compilerOptions = null
) => {
  const response = await axios.post(`${API_URL}/run`, {
    sourceCode,
    languageId,
    compilerOptions,
  });

  return response.data;
};
