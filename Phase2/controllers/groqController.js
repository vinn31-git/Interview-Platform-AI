const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateQuestions = async (req, res) => {
  try {
    const {
      role,
      experience,
      difficulty,
      interviewType,
    } = req.body;

    let prompt = "";

    // DSA or DSA + Technical — structured coding problem
    if (interviewType === "DSA" || interviewType === "DSA + Technical") {
      prompt = `
Generate ONE DSA coding interview problem.

Role: ${role}
Experience: ${experience}
Difficulty: ${difficulty}

Return ONLY valid JSON in this format:

{
  "title": "",
  "difficulty": "",
  "description": "",
  "constraints": [
    ""
  ],
  "examples": [
    {
      "input": "",
      "output": ""
    }
  ],
  "starterCode": "function solve() {\\n\\n}",
  "testCases": [
    {
      "input": "",
      "expectedOutput": ""
    }
  ]
}
`;
    } else {
      prompt = `
Generate 10 interview questions.

Role: ${role}
Experience: ${experience}
Difficulty: ${difficulty}
Interview Type: ${interviewType}

Return only the questions as a numbered list.
`;
    }

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content =
      completion.choices[0].message.content;

    // DSA Response
    if (interviewType === "DSA" || interviewType === "DSA + Technical") {
      try {
        const cleanedContent = content
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        const problem =
          JSON.parse(cleanedContent);

        return res.status(200).json({
          success: true,
          type: "dsa",
          problem,
        });
      } catch (parseError) {
        console.error("Parse Error:", parseError.message);

        return res.status(500).json({
          success: false,
          message:
            "Failed to parse DSA problem",
        });
      }
    }

    // HR / Technical / System Design
    const questions = content
      .split("\n")
      .filter((q) => q.trim() !== "");

    res.status(200).json({
      success: true,
      type: "questions",
      questions,
    });

  } catch (error) {
    console.error("Generate Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to generate questions",
    });
  }
};

module.exports = {
  generateQuestions,
};