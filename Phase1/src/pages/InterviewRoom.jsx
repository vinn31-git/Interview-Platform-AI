import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import CodeEditor from "../components/CodeEditor";
import InterviewTimer from "../components/InterviewTimer";
import { runCode } from "../services/judge0Service";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const languageMap = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
};

const InterviewRoom = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [code, setCode] = useState(`function solve() {

}`);

  const [language, setLanguage] = useState("javascript");
  const [showEditor, setShowEditor] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ==========================
  // Judge0 States
  const [output, setOutput] = useState("");
  const [runningCode, setRunningCode] = useState(false);
  // ==========================
  // Speech To Text
  // ==========================
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  // ==========================
  // Progress Bar
  // ==========================
  const progressPercentage = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;
  let interviewDetails = {};
  try {
    interviewDetails = JSON.parse(
      localStorage.getItem("interviewDetails") || "{}"
    );
  } catch (error) {
    console.error(
      "Invalid interviewDetails in localStorage:",
      error
    );

    interviewDetails = {};
  }
  // ==========================
  // Dynamic Timer
  // ==========================

  const durationMap = {
    "20 Minutes": 20 * 60,
    "30 Minutes": 30 * 60,
    "45 Minutes": 45 * 60,
    "60 Minutes": 60 * 60,
  };

  const interviewDuration =
    durationMap[
    interviewDetails?.duration
    ] || 1200;

  useEffect(() => {
    let storedQuestions = [];

    try {
      storedQuestions = JSON.parse(
        localStorage.getItem("questions") || "[]"
      );
    } catch (error) {
      console.error(
        "Invalid questions in localStorage:",
        error
      );

      storedQuestions = [];
    }

    if (storedQuestions) {
      setQuestions(storedQuestions);
    }
  }, []);

  const handleRunCode = async () => {
    try {
      setRunningCode(true);

      const languageId =
        languageMap[language];

      const result = await runCode(
        code,
        languageId
      );

      setOutput(result.output);
    } catch (error) {
      console.error(error);

      setOutput(
        "Error while executing code."
      );
    } finally {
      setRunningCode(false);
    }
  };
  const handleSpeakQuestion = () => {
    if (!questions.length) return;

    speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        questions[currentQuestion]
      );

    utterance.rate = 1;
    utterance.pitch = 1;

    speechSynthesis.speak(utterance);
  };

  const handleStopSpeaking = () => {
    speechSynthesis.cancel();
  };
  // ==========================
  // Speech To Text Handlers
  // ==========================
  const handleStartRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech Recognition not supported in this browser."
      );
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[
          event.results.length - 1
        ][0].transcript;

      setAnswer((prev) =>
        prev.trim()
          ? `${prev} ${transcript}`
          : transcript
      );
    };

    recognition.onerror = (error) => {
      console.error(error);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current =
      recognition;

    recognition.start();
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsRecording(false);
  };

  const handleSubmitAnswer = () => {
    if (!answer.trim()) {
      alert("Please enter an answer.");
      return;
    }

    setIsSubmitted(true);

    alert(
      "Answer submitted successfully!"
    );
  };
  speechSynthesis.cancel();
  const handleNextQuestion = () => {
    if (!isSubmitted) {
      alert(
        "Please submit your answer first."
      );

      return;
    }

    const currentAnswer = {
      question:
        questions[currentQuestion],
      answer,
    };

    const updatedAnswers = [
      ...answers,
      currentAnswer,
    ];

    setAnswers(updatedAnswers);

    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );

      setAnswer("");
      setIsSubmitted(false);
    } else {
      localStorage.setItem(
        "answers",
        JSON.stringify(updatedAnswers)
      );

      navigate("/results");
    }
  };
  speechSynthesis.cancel();
  const handleEndInterview = () => {
    localStorage.setItem(
      "answers",
      JSON.stringify(answers)
    );

    navigate("/results");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              AI Interview
            </h1>

            <p className="text-gray-500">
              Mock Interview Session
            </p>
          </div>

          <InterviewTimer
            duration={interviewDuration}
            onTimeUp={() => {
              alert("Time's up!");
              handleEndInterview();
            }}
          />
        </div>

        {/* AI Interviewer */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            AI Interviewer
          </h2>

          <div className="flex flex-col items-center justify-center gap-4 h-56 border-2 border-dashed border-gray-300 rounded-lg">

            <div className="text-6xl">
              🤖
            </div>

            <p className="text-gray-500">
              AI Interview Assistant
            </p>

            <div className="flex gap-3">
              <Button
                onClick={handleSpeakQuestion}
              >
                🔊 Speak Question
              </Button>

              <Button
                variant="outline"
                onClick={handleStopSpeaking}
              >
                🛑 Stop
              </Button>
            </div>

          </div>
        </div>

        {/* Webcam */}
        <div className="fixed bottom-28 right-6 z-50">
          <div className="w-64 h-40 bg-white rounded-xl shadow-lg overflow-hidden border">
            <Webcam
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Question {currentQuestion + 1}
              {" "}of {questions.length}
            </h2>

            <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
              AI Generated
            </span>
          </div>

          <div className="mb-4">
            <Progress
              value={progressPercentage}
            />
          </div>

          <p className="text-lg leading-relaxed">
            {questions.length > 0
              ? questions[currentQuestion]
              : "Loading questions..."}
          </p>
        </div>

        {/* Toggle Editor */}
        <div className="mb-6">
          <Button
            onClick={() =>
              setShowEditor(!showEditor)
            }
          >
            {showEditor
              ? "Hide Coding Editor"
              : "Show Coding Editor"}
          </Button>
        </div>

        {/* Coding Section */}
        {showEditor && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Coding Editor
              </h3>

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(
                    e.target.value
                  )
                }
                className="border rounded-lg px-3 py-2"
              >
                <option value="javascript">
                  JavaScript
                </option>

                <option value="python">
                  Python
                </option>

                <option value="java">
                  Java
                </option>

                <option value="cpp">
                  C++
                </option>

                <option value="c">
                  C
                </option>
              </select>
            </div>

            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
            />

            <div className="mt-4">
              <Button
                onClick={handleRunCode}
                disabled={runningCode}
              >
                {runningCode
                  ? "Running..."
                  : "Run Code"}
              </Button>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">
                Output
              </h3>

              <div className="bg-black text-green-400 p-4 rounded-lg min-h-[120px] whitespace-pre-wrap">
                {output ||
                  "Code output will appear here"}
              </div>
            </div>

          </div>
        )}

        {/* Answer Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-3">

            <h3 className="text-lg font-semibold">
              Your Answer
            </h3>

            <div className="flex gap-2">

              <Button
                onClick={handleStartRecording}
                disabled={isRecording}
              >
                🎤 Start Recording
              </Button>

              <Button
                variant="outline"
                onClick={handleStopRecording}
                disabled={!isRecording}
              >
                🛑 Stop Recording
              </Button>

            </div>
          </div>

          {isRecording && (
            <p className="text-green-600 mb-3">
              Listening...
            </p>
          )}

          <textarea
            rows="10"
            value={answer}
            onChange={(e) =>
              setAnswer(e.target.value)
            }
            placeholder="Type or speak your answer..."
            className="w-full border border-gray-300 rounded-lg p-4"
          />
        </div>
        {/* Action Buttons */}
        <div className="flex justify-end gap-4">

          <Button
            variant="outline"
            onClick={handleEndInterview}
          >
            End Interview
          </Button>

          <Button
            onClick={handleSubmitAnswer}
            disabled={isSubmitted}
          >
            {isSubmitted
              ? "Submitted ✓"
              : "Submit Answer"}
          </Button>

          <Button
            onClick={handleNextQuestion}
          >
            {currentQuestion ===
              questions.length - 1
              ? "Finish Interview"
              : "Next Question →"}
          </Button>

        </div>

      </div>
    </div>
  );
};

export default InterviewRoom;