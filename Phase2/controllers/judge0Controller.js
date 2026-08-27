const axios = require("axios");

const runCode = async (req, res) => {
  try {
    const { sourceCode, languageId, compilerOptions } = req.body;

    if (!sourceCode || !languageId) {
      return res.status(400).json({
        message: "sourceCode and languageId are required",
      });
    }

    const allowedLanguages = [45, 46, 50, 54, 62, 63, 71, 74, 93]; // List of supported Judge0 language IDs
    if (!allowedLanguages.includes(Number(languageId))) {
      return res.status(400).json({
        message: "Unsupported language ID",
      });
    }

    const payload = {
      source_code: sourceCode,
      language_id: languageId,
    };

    // Support for test cases
    if (req.body.stdin) payload.stdin = req.body.stdin;
    if (req.body.expectedOutput) payload.expected_output = req.body.expectedOutput;

    if (compilerOptions) {
      payload.compiler_options = compilerOptions;
    }

    const submissionResponse = await axios.post(
      "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
      payload
    );

    const data = submissionResponse.data;
    const output =
      data.stdout ||
      data.stderr ||
      data.compile_output ||
      data.message ||
      "No Output";

    return res.status(200).json({
      output,
      status: data.status?.description || "Done",
    });
  } catch (error) {
    console.error("Judge0 error:", error?.response?.data || error.message);

    return res.status(500).json({
      message: "Code execution failed",
      detail: error?.response?.data?.message || error.message,
    });
  }
};

module.exports = {
  runCode,
};
