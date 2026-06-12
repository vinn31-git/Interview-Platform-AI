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

    const prompt = `
Generate 10 interview questions.

Role: ${role}
Experience: ${experience}
Difficulty: ${difficulty}
Interview Type: ${interviewType}

Return only the questions as a numbered list.
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
     const questionsText =
  completion.choices[0].message.content;

const questions = questionsText
  .split("\n")
  .filter((q) => q.trim() !== "");

res.status(200).json({
  success: true,
  questions,
});

    
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate questions",
    });
  }
};

module.exports = {
  generateQuestions,
};