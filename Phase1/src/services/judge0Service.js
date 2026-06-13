import axios from "axios";

const API_URL =
  "http://localhost:5000/api/judge0";

export const runCode = async (
  sourceCode,
  languageId
) => {
  const response = await axios.post(
    `${API_URL}/run`,
    {
      sourceCode,
      languageId,
    }
  );

  return response.data;
};