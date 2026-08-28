import axiosInstance from "./axiosConfig";

export const runCode = async (
  sourceCode,
  languageId,
  compilerOptions = null
) => {
  const response = await axiosInstance.post(`/judge0/run`, {
    sourceCode,
    languageId,
    compilerOptions,
  });

  return response.data;
};
