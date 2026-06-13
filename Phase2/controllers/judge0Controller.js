const axios = require("axios");

const runCode = async (req, res) => {
  try {
    const { sourceCode, languageId } = req.body;

    const submissionResponse = await axios.post(
      "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: sourceCode,
        language_id: languageId,
      }
    );

    return res.status(200).json({
      output:
        submissionResponse.data.stdout ||
        submissionResponse.data.stderr ||
        submissionResponse.data.compile_output ||
        "No Output",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Code execution failed",
    });
  }
};

module.exports = {
  runCode,
};