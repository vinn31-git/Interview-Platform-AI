const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const evaluateInterview = async (req, res) => {
  try {
    const { role, answers } = req.body;

    const prompt = `
You are an expert technical interviewer.

Role: ${role}

Candidate Answers:
${JSON.stringify(answers)}

Evaluate the candidate and return ONLY valid JSON.

Format:

{
  "overallScore": 0,
  "technicalScore": 0,
  "communicationScore": 0,
  "strengths": [],
  "improvements": []
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const result =
      completion.choices[0].message.content;

    console.log("=================================");
    console.log("RAW RESULT:");
    console.log(result);
    console.log("=================================");

    const cleanedResult = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("=================================");
    console.log("CLEANED RESULT:");
    console.log(cleanedResult);
    console.log("=================================");

    try {
      const parsedEvaluation =
        JSON.parse(cleanedResult);

      res.status(200).json({
        success: true,
        evaluation: parsedEvaluation,
      });
    } catch (parseError) {
      console.log("=================================");
      console.log("JSON PARSE ERROR:");
      console.log(parseError);
      console.log("FAILED CONTENT:");
      console.log(cleanedResult);
      console.log("=================================");

      return res.status(500).json({
        success: false,
        message: "Invalid AI response format",
      });
    }

  } catch (error) {
    console.log("=================================");
    console.log("EVALUATION ERROR:");
    console.log(error);
    console.log("=================================");

    res.status(500).json({
      success: false,
      message: "Evaluation Failed",
    });
  }
};

module.exports = {
  evaluateInterview,
};