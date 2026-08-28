import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import CodeEditor from "../components/codeEditor";
import InterviewTimer from "../components/InterviewTimer";
import { runCode } from "../services/judge0Service";
import {
  initInterviewer,
  chatWithInterviewer,
  presentQuestion,
} from "../services/interviewerService";
import { saveInterviewResults } from "../services/interviewHistoryService";
import { useSpeech } from "../hooks/useSpeech";
import {
  LANGUAGES,
  getLanguageById,
  DEFAULT_LANGUAGE_ID,
} from "../lib/languages";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Send,
  Play,
  ChevronRight,
  LogOut,
  Loader2,
} from "lucide-react";

const difficultyColor = {
  Easy: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  Medium: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  Hard: "text-red-400 border-red-500/30 bg-red-500/10",
};

const InterviewRoom = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const userInputRef = useRef("");

  const [questions, setQuestions] = useState([]);
  const [dsaProblem, setDsaProblem] = useState(null);
  const [isDsaMode, setIsDsaMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);

  const [languageId, setLanguageId] = useState(DEFAULT_LANGUAGE_ID);
  const langConfig = getLanguageById(languageId);
  const [code, setCode] = useState(langConfig.defaultCode);
  const [output, setOutput] = useState("");
  const [runningCode, setRunningCode] = useState(false);
  const [activeTab, setActiveTab] = useState("code");

  const [conversation, setConversation] = useState([]);
  const [phase, setPhase] = useState("intro");
  const [userInput, setUserInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const {
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    isSpeaking,
    isListening,
    interimText,
  } = useSpeech();

  let interviewDetails = {};
  try {
    interviewDetails = JSON.parse(
      localStorage.getItem("interviewDetails") || "{}"
    );
  } catch {
    interviewDetails = {};
  }

  const durationMap = {
    "20 Minutes": 20 * 60,
    "30 Minutes": 30 * 60,
    "45 Minutes": 45 * 60,
    "60 Minutes": 60 * 60,
  };

  const interviewDuration =
    durationMap[interviewDetails?.duration] || 1200;

  const totalQuestions = isDsaMode ? 1 : questions.length;
  const progressPercentage =
    totalQuestions > 0
      ? ((currentQuestion + 1) / totalQuestions) * 100
      : 0;

  const getInterviewContext = useCallback(
    () => ({
      role: interviewDetails.role || "Software Engineer",
      experience: interviewDetails.experience || "Not specified",
      difficulty: interviewDetails.difficulty || "Medium",
      interviewType: interviewDetails.interviewType || "Technical",
      questionNumber: isDsaMode ? 1 : currentQuestion + 1,
      totalQuestions: totalQuestions || 1,
    }),
    [interviewDetails, currentQuestion, totalQuestions, isDsaMode]
  );

  const getCurrentQuestionText = useCallback(() => {
    if (isDsaMode && dsaProblem) {
      return `${dsaProblem.title}\n\n${dsaProblem.description}`;
    }
    return questions[currentQuestion] || "";
  }, [isDsaMode, dsaProblem, questions, currentQuestion]);

  const addInterviewerMessage = useCallback(
    (content) => {
      setConversation((prev) => [
        ...prev,
        { role: "interviewer", content },
      ]);
      speak(content);
    },
    [speak]
  );

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, interimText]);

  useEffect(() => {
    try {
      const mode = localStorage.getItem("interviewMode");
      if (mode === "dsa") {
        const problem = JSON.parse(
          localStorage.getItem("dsaProblem") || "null"
        );
        if (problem) {
          setDsaProblem(problem);
          setIsDsaMode(true);
          if (problem.starterCode) setCode(problem.starterCode);
        }
      } else {
        setQuestions(
          JSON.parse(localStorage.getItem("questions") || "[]")
        );
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Failed to load interview data:", error.message);
      }
    }
  }, []);

  useEffect(() => {
    if (interviewStarted) return;

    const startInterview = async () => {
      setAiLoading(true);
      try {
        const response = await initInterviewer(getInterviewContext());
        addInterviewerMessage(response.reply);
        setPhase(response.phase);
        setInterviewStarted(true);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Init Interview Error:", error.message);
        }
        addInterviewerMessage(
          "Hello! I'm Priya, your AI interviewer today. Before we begin, could you please introduce yourself — tell me about your background and experience?"
        );
        setInterviewStarted(true);
      } finally {
        setAiLoading(false);
      }
    };

    startInterview();
  }, [interviewStarted, getInterviewContext, addInterviewerMessage]);

  const handleSendMessage = async (messageText) => {
    const text = (messageText || userInput).trim();
    if (!text || aiLoading) return;

    setUserInput("");
    userInputRef.current = "";
    stopListening();

    const updatedConversation = [
      ...conversation,
      { role: "candidate", content: text },
    ];
    setConversation(updatedConversation);
    setAiLoading(true);

    try {
      const response = await chatWithInterviewer({
        conversation: updatedConversation,
        interviewContext: getInterviewContext(),
        currentQuestion: phase !== "intro" ? getCurrentQuestionText() : null,
        phase,
        userMessage: text,
      });

      const newConversation = [
        ...updatedConversation,
        { role: "interviewer", content: response.reply },
      ];
      setConversation(newConversation);
      speak(response.reply);
      setPhase(response.phase);

      if (response.action === "next_question") {
        setTimeout(() => handleMoveToNextQuestion(newConversation), 2000);
      } else if (response.action === "end_interview") {
        setTimeout(() => finishInterview(newConversation), 2000);
      } else if (
        phase === "intro" &&
        response.phase === "question" &&
        !isDsaMode
      ) {
        setTimeout(() => presentCurrentQuestion(newConversation), 1500);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Chat Error:", error.message);
      }
      addInterviewerMessage(
        "Thank you for sharing that. Could you elaborate a bit more on your experience?"
      );
    } finally {
      setAiLoading(false);
    }
  };

  const presentCurrentQuestion = async (existingConversation) => {
    setAiLoading(true);
    try {
      const response = await presentQuestion({
        interviewContext: getInterviewContext(),
        currentQuestion: getCurrentQuestionText(),
        questionNumber: currentQuestion + 1,
      });

      setConversation([
        ...(existingConversation || conversation),
        { role: "interviewer", content: response.reply },
      ]);
      speak(response.reply);
      setPhase("question");
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Present Question Error:", error.message);
      }
      const fallback = `Alright, let's move to your first question. ${getCurrentQuestionText()}`;
      addInterviewerMessage(fallback);
      setPhase("question");
    } finally {
      setAiLoading(false);
    }
  };

  const handleStartQuestionPhase = () => {
    if (phase === "intro") {
      presentCurrentQuestion(conversation);
    }
  };

  const buildCurrentAnswer = (conv) => ({
    questionIndex: isDsaMode ? 0 : currentQuestion,
    question: isDsaMode
      ? `${dsaProblem?.title}: ${dsaProblem?.description}`
      : questions[currentQuestion],
    answer: conv
      .filter((m) => m.role === "candidate")
      .map((m) => m.content)
      .join("\n"),
    conversation: conv,
    code,
    codeOutput: output,
    language: langConfig.label,
    languageId,
  });

  const syncAnswersToBackend = async (updatedAnswers) => {
    try {
      const interviewId = localStorage.getItem("interviewId");
      if (interviewId) {
        await saveInterviewResults(interviewId, { answers: updatedAnswers });
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Failed to sync progressive answers to backend:", error.message);
      }
    }
  };

  const handleMoveToNextQuestion = (conv) => {
    const currentConv = conv || conversation;
    const currentAnswer = buildCurrentAnswer(currentConv);
    const updatedAnswers = [...answers, currentAnswer];

    localStorage.setItem("answers", JSON.stringify(updatedAnswers));

    if (isDsaMode || currentQuestion >= questions.length - 1) {
      syncAnswersToBackend(updatedAnswers).finally(() => {
        navigate("/results");
      });
      return;
    }

    syncAnswersToBackend(updatedAnswers);
    setAnswers(updatedAnswers);
    setCurrentQuestion((prev) => prev + 1);
    setConversation([]);
    setPhase("question");
    setOutput("");
    setCode(getLanguageById(languageId).defaultCode);

    setTimeout(() => {
      presentQuestion({
        interviewContext: {
          ...getInterviewContext(),
          questionNumber: currentQuestion + 2,
        },
        currentQuestion: questions[currentQuestion + 1],
        questionNumber: currentQuestion + 2,
      }).then((response) => {
        addInterviewerMessage(response.reply);
      });
    }, 500);
  };

  const finishInterview = (conv) => {
    const currentConv = conv || conversation;
    const finalAnswers = [...answers, buildCurrentAnswer(currentConv)];
    localStorage.setItem("answers", JSON.stringify(finalAnswers));
    syncAnswersToBackend(finalAnswers).finally(() => {
      navigate("/results");
    });
  };

  const handleEndInterview = () => {
    if (conversation.length > 0) {
      finishInterview(conversation);
    } else {
      navigate("/results");
    }
  };

  const handleRunCode = async () => {
    try {
      setRunningCode(true);
      setActiveTab("output");
      const result = await runCode(
        code,
        langConfig.judge0Id,
        langConfig.compilerOptions || null
      );
      setOutput(result.output || "No output");
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Run Code Error:", error.message);
      }
      setOutput("Error while executing code.");
    } finally {
      setRunningCode(false);
    }
  };

  const handleLanguageChange = (newLangId) => {
    const newLang = getLanguageById(newLangId);
    setLanguageId(newLangId);
    if (!isDsaMode) {
      setCode(newLang.defaultCode);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
      return;
    }

    startListening((finalText) => {
      setUserInput((prev) => {
        const updated = prev.trim()
          ? `${prev.trim()} ${finalText}`
          : finalText;
        userInputRef.current = updated;
        return updated;
      });
    });
  };

  const getQuestionTitle = () => {
    if (isDsaMode && dsaProblem) return dsaProblem.title || "Coding Problem";
    if (phase === "intro") return "Introduction";
    return `Question ${currentQuestion + 1}`;
  };

  return (
    <div className="h-screen flex flex-col bg-[#0d1117] text-foreground overflow-hidden">
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-bold text-primary">InterviewMate</span>
          <Badge variant="secondary" className="text-xs">
            {interviewDetails.role}
          </Badge>
          <Badge
            variant="outline"
            className="text-xs capitalize hidden sm:inline-flex"
          >
            {phase}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-28 hidden md:block">
            <Progress value={progressPercentage} className="h-1.5" />
          </div>
          <InterviewTimer
            duration={interviewDuration}
            onTimeUp={handleEndInterview}
          />
          <Button variant="outline" size="sm" onClick={handleEndInterview}>
            <LogOut className="w-3.5 h-3.5 mr-1" />
            End
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT — Conversation + Problem */}
        <div className="w-full lg:w-[45%] flex flex-col border-r border-border">
          {/* Interviewer header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/80 shrink-0">
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg ${
                  isSpeaking ? "ring-2 ring-primary/50" : ""
                }`}
              >
                👩‍💼
              </div>
              {(isSpeaking || isListening) && (
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                    isListening ? "bg-amber-400" : "bg-emerald-400"
                  }`}
                />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Priya — AI Interviewer</p>
              <p className="text-xs text-muted-foreground">
                {isSpeaking
                  ? "Speaking..."
                  : isListening
                    ? "Listening to you..."
                    : aiLoading
                      ? "Thinking..."
                      : "Ready"}
              </p>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {conversation.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "candidate" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.role === "candidate"
                      ? "bg-primary/20 text-foreground rounded-br-sm"
                      : "bg-secondary/60 text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.role === "interviewer" && (
                    <p className="text-xs text-primary font-medium mb-1">
                      Priya
                    </p>
                  )}
                  {msg.content}
                </div>
              </div>
            ))}

            {interimText && (
              <div className="flex justify-end">
                <div className="max-w-[85%] px-3 py-2 rounded-xl text-sm bg-primary/10 text-muted-foreground italic">
                  {interimText}...
                </div>
              </div>
            )}

            {aiLoading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-3 h-3 animate-spin" />
                Priya is thinking...
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Problem panel (when not intro) */}
          {phase !== "intro" && getCurrentQuestionText() && (
            <div className="border-t border-border px-4 py-3 max-h-48 overflow-y-auto shrink-0 bg-card/40">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold">{getQuestionTitle()}</h3>
                {(isDsaMode
                  ? dsaProblem?.difficulty
                  : interviewDetails.difficulty) && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded border ${
                      difficultyColor[
                        isDsaMode
                          ? dsaProblem?.difficulty
                          : interviewDetails.difficulty
                      ] || difficultyColor.Medium
                    }`}
                  >
                    {isDsaMode
                      ? dsaProblem?.difficulty
                      : interviewDetails.difficulty}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-4">
                {getCurrentQuestionText()}
              </p>
              {isDsaMode && dsaProblem?.examples?.[0] && (
                <p className="text-xs font-mono text-muted-foreground mt-2">
                  Example: Input: {dsaProblem.examples[0].input} → Output:{" "}
                  {dsaProblem.examples[0].output}
                </p>
              )}
            </div>
          )}

          {/* Input area */}
          <div className="border-t border-border p-3 shrink-0 bg-card">
            <div className="flex gap-2">
              <textarea
                rows={2}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  isListening
                    ? "Listening... speak now"
                    : "Type or speak your answer..."
                }
                className="flex-1 border border-border bg-secondary/30 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  variant={isListening ? "default" : "outline"}
                  onClick={toggleMic}
                  className="h-9 w-9 p-0"
                  title={isListening ? "Stop recording" : "Start recording"}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSendMessage()}
                  disabled={!userInput.trim() || aiLoading}
                  className="h-9 w-9 p-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              {phase === "intro" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleStartQuestionPhase}
                  className="text-xs"
                >
                  Start Technical Questions →
                </Button>
              )}
              {phase !== "intro" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMoveToNextQuestion()}
                  className="text-xs gap-1"
                >
                  {isDsaMode || currentQuestion >= questions.length - 1
                    ? "Finish Interview"
                    : "Next Question"}
                  <ChevronRight className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>

          <div className="px-3 pb-2 hidden sm:block">
            <div className="w-20 h-14 rounded-lg overflow-hidden border border-border">
              <Webcam
                audio={false}
                className="w-full h-full object-cover scale-x-[-1]"
              />
            </div>
          </div>
        </div>

        {/* RIGHT — Code IDE */}
        <div className="hidden lg:flex lg:w-[55%] flex-col overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-[#161b22] shrink-0">
            <div className="flex gap-1">
              {["code", "output"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-sm rounded capitalize ${
                    activeTab === tab
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={languageId}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="text-xs border border-border bg-secondary/50 rounded px-2 py-1.5 max-w-[180px] focus:outline-none"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <Button
                size="sm"
                onClick={handleRunCode}
                disabled={runningCode}
                className="gap-1"
              >
                <Play className="w-3.5 h-3.5" />
                {runningCode ? "Running..." : "Run"}
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === "code" ? (
              <CodeEditor
                code={code}
                setCode={setCode}
                language={langConfig.monaco}
                height="100%"
              />
            ) : (
              <div className="h-full p-4 font-mono text-sm overflow-auto bg-[#0d1117]">
                <pre className="text-emerald-400 whitespace-pre-wrap">
                  {output || "// Run your code to see output here"}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile editor */}
      <div className="lg:hidden border-t border-border shrink-0">
        <div className="flex items-center justify-between px-3 py-2 bg-[#161b22]">
          <select
            value={languageId}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="text-xs border border-border bg-secondary/50 rounded px-2 py-1"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
          <Button size="sm" onClick={handleRunCode} disabled={runningCode}>
            Run
          </Button>
        </div>
        <div className="h-48">
          <CodeEditor
            code={code}
            setCode={setCode}
            language={langConfig.monaco}
            height="192px"
          />
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;
