const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are Priya, a professional technical interviewer at a top Indian tech company.
Speak naturally like a real interviewer — warm, clear, slightly Indian English tone (not exaggerated).
Keep responses concise (2-4 sentences unless explaining something technical).

Your responsibilities:
1. START with a brief intro and ask the candidate to introduce themselves (background, skills, experience).
2. Listen to their answers. Ask 1-2 follow-up questions on their intro before moving to technical questions.
3. When presenting a technical/coding question, introduce it conversationally — don't just read it verbatim.
4. If the candidate asks a clarifying question, answer it helpfully like a real interviewer would.
5. Ask follow-ups: "Can you walk me through your approach?", "What's the time complexity?", "How would you handle edge cases?"
6. Probe deeper if answers are vague. Encourage thinking aloud.
7. When satisfied with a question, say exactly: [NEXT_QUESTION] to signal moving on.
8. When the interview is complete, say exactly: [END_INTERVIEW]

Rules:
- Never give away the full solution.
- Be encouraging but honest.
- Reference the candidate's previous answers when relevant.
- For DSA problems, you may clarify constraints/examples if asked.`;

const buildMessages = ({
  conversation,
  interviewContext,
  currentQuestion,
  phase,
  userMessage,
}) => {
  const contextBlock = `
Interview Context:
- Role: ${interviewContext.role}
- Experience: ${interviewContext.experience}
- Difficulty: ${interviewContext.difficulty}
- Type: ${interviewContext.interviewType}
- Phase: ${phase}
- Question ${interviewContext.questionNumber} of ${interviewContext.totalQuestions}
${currentQuestion ? `\nCurrent Question/Problem:\n${currentQuestion}` : ""}
`;

  const messages = [
    { role: "system", content: SYSTEM_PROMPT + contextBlock },
  ];

  if (conversation?.length) {
    conversation.forEach((msg) => {
      messages.push({
        role: msg.role === "interviewer" ? "assistant" : "user",
        content: msg.content,
      });
    });
  }

  if (userMessage) {
    messages.push({ role: "user", content: userMessage });
  }

  return messages;
};

const getInitialMessage = async (req, res) => {
  try {
    const { interviewContext } = req.body;

    const messages = buildMessages({
      conversation: [],
      interviewContext,
      currentQuestion: null,
      phase: "intro",
      userMessage:
        "The candidate has joined the interview room. Greet them warmly, introduce yourself as Priya their AI interviewer, and ask them to tell you about themselves — their background, skills, and what role they're targeting.",
    });

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages,
      temperature: 0.7,
      max_tokens: 300,
    });

    const reply = completion.choices[0].message.content.trim();

    res.status(200).json({
      success: true,
      reply,
      phase: "intro",
      action: "wait_for_candidate",
    });
  } catch (error) {
    console.error("INTERVIEWER INIT ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to start interview conversation",
    });
  }
};

const chatWithInterviewer = async (req, res) => {
  try {
    const {
      conversation,
      interviewContext,
      currentQuestion,
      phase,
      userMessage,
    } = req.body;

    if (!userMessage?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const messages = buildMessages({
      conversation,
      interviewContext,
      currentQuestion,
      phase,
      userMessage,
    });

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages,
      temperature: 0.7,
      max_tokens: 400,
    });

    let reply = completion.choices[0].message.content.trim();
    let action = "continue";
    let nextPhase = phase;

    if (reply.includes("[NEXT_QUESTION]")) {
      reply = reply.replace("[NEXT_QUESTION]", "").trim();
      action = "next_question";
      nextPhase = "question";
    }

    if (reply.includes("[END_INTERVIEW]")) {
      reply = reply.replace("[END_INTERVIEW]", "").trim();
      action = "end_interview";
      nextPhase = "complete";
    }

    if (phase === "intro" && action === "continue") {
      const introTurns = conversation.filter(
        (m) => m.role === "candidate"
      ).length;
      if (introTurns >= 2) {
        nextPhase = "question";
      }
    }

    res.status(200).json({
      success: true,
      reply,
      phase: nextPhase,
      action,
    });
  } catch (error) {
    console.error("INTERVIEWER CHAT ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get interviewer response",
    });
  }
};

const presentQuestion = async (req, res) => {
  try {
    const { interviewContext, currentQuestion, questionNumber } = req.body;

    const messages = buildMessages({
      conversation: [],
      interviewContext: {
        ...interviewContext,
        questionNumber,
      },
      currentQuestion,
      phase: "question",
      userMessage: `Intro is done. Now present Question ${questionNumber} to the candidate conversationally. Set context, then state the question clearly. Ask them to think aloud and explain their approach. Do NOT say [NEXT_QUESTION] yet.`,
    });

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0].message.content.trim();

    res.status(200).json({
      success: true,
      reply,
      phase: "question",
      action: "wait_for_candidate",
    });
  } catch (error) {
    console.error("PRESENT QUESTION ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to present question",
    });
  }
};

module.exports = {
  getInitialMessage,
  chatWithInterviewer,
  presentQuestion,
};
