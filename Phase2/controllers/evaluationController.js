const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const buildEvaluationPrompt = ({
  role,
  experience,
  difficulty,
  interviewType,
  answers,
}) => {
  const formattedAnswers = answers
    .map((item, index) => {
      let block = `Question ${index + 1}: ${item.question}\n`;

      if (item.conversation?.length) {
        block += `Full Interview Conversation:\n`;
        item.conversation.forEach((msg) => {
          block += `${msg.role === "interviewer" ? "Interviewer" : "Candidate"}: ${msg.content}\n`;
        });
      } else {
        block += `Verbal Answer: ${item.answer || "(No verbal answer)"}\n`;
      }

      if (item.code) {
        block += `Code Submission:\n${item.code}\n`;
      }

      if (item.codeOutput) {
        block += `Code Output:\n${item.codeOutput}\n`;
      }

      if (item.language) {
        block += `Language: ${item.language}\n`;
      }

      return block;
    })
    .join("\n---\n\n");

  return `You are a senior technical interviewer providing a detailed post-interview analysis.

Role: ${role}
Experience Level: ${experience || "Not specified"}
Difficulty: ${difficulty || "Not specified"}
Interview Type: ${interviewType || "Not specified"}

Candidate Responses:
${formattedAnswers}

Evaluate holistically based on the FULL conversation transcript — how the candidate communicated, responded to follow-ups, asked clarifying questions, and explained their thinking. For coding questions, assess algorithm correctness, time/space complexity awareness, code quality, and test case handling.

Return ONLY valid JSON (no markdown):

{
  "overallScore": 0,
  "technicalScore": 0,
  "communicationScore": 0,
  "problemSolvingScore": 0,
  "codeQualityScore": 0,
  "summary": "",
  "verdict": "",
  "strengths": [],
  "improvements": [],
  "recommendations": [],
  "questionBreakdown": [
    {
      "question": "",
      "score": 0,
      "feedback": "",
      "codeReview": ""
    }
  ]
}

Rules:
- All scores are integers 0-10
- overallScore = weighted average (technical 35%, communication 20%, problem-solving 25%, code quality 20%). If no code was submitted, redistribute code quality weight to technical.
- verdict: one of "Strong Hire", "Hire", "Lean Hire", "No Hire", "Strong No Hire"
- strengths/improvements: 3-5 specific points each
- recommendations: 2-4 actionable next steps
- summary: 2-3 sentence assessment
- questionBreakdown: one entry per question; codeReview only if code was submitted`;
};

const parseEvaluationResponse = (rawResult) => {
  const cleanedResult = rawResult
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleanedResult);

  return {
    overallScore: 0,
    technicalScore: 0,
    communicationScore: 0,
    problemSolvingScore: 0,
    codeQualityScore: 0,
    summary: "Evaluation completed.",
    verdict: "Lean Hire",
    strengths: [],
    improvements: [],
    recommendations: [],
    questionBreakdown: [],
    ...parsed,
  };
};

const evaluateInterview = async (req, res) => {
  try {
    const {
      role,
      experience,
      difficulty,
      interviewType,
      answers,
    } = req.body;

    if (!role || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Role and answers are required",
      });
    }

    const prompt = buildEvaluationPrompt({
      role,
      experience,
      difficulty,
      interviewType,
      answers,
    });

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const result = completion.choices[0].message.content;

    try {
      const parsedEvaluation = parseEvaluationResponse(result);

      res.status(200).json({
        success: true,
        evaluation: parsedEvaluation,
      });
    } catch (parseError) {
      console.error("JSON PARSE ERROR:", parseError.message);

      return res.status(500).json({
        success: false,
        message: "Invalid AI response format",
      });
    }
  } catch (error) {
    console.error("EVALUATION ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Evaluation Failed",
    });
  }
};

module.exports = {
  evaluateInterview,
};
