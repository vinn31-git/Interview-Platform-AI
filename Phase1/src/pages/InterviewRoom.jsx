import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import CodeEditor from "../components/CodeEditor";

const InterviewRoom = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);

  const [code, setCode] = useState(`function solve() {

}`);

  const [showEditor, setShowEditor] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const storedQuestions = JSON.parse(
      localStorage.getItem("questions")
    );

    if (storedQuestions) {
      setQuestions(storedQuestions);
    }
  }, []);

  const handleSubmitAnswer = () => {
    if (!answer.trim()) {
      alert("Please enter an answer.");
      return;
    }

    setIsSubmitted(true);
    alert("Answer submitted successfully!");
  };

  const handleNextQuestion = () => {
    if (!isSubmitted) {
      alert("Please submit your answer first.");
      return;
    }

    const currentAnswer = {
      question: questions[currentQuestion],
      answer,
    };

    const updatedAnswers = [...answers, currentAnswer];

    setAnswers(updatedAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
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

  const handleEndInterview = () => {
    localStorage.setItem(
      "answers",
      JSON.stringify(answers)
    );

    navigate("/results");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
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

          <div className="bg-black text-white px-4 py-2 rounded-lg font-semibold">
            ⏱ 05:00
          </div>
        </div>

        {/* AI Interviewer */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            AI Interviewer
          </h2>

          <div className="h-56 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
            AI Interview Assistant Panel
          </div>
        </div>

        {/* Floating Webcam */}
        <div className="fixed bottom-28 right-6 z-50">
          <div className="w-64 h-40 bg-white rounded-xl shadow-lg overflow-hidden border">
            <Webcam
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Question Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Question {currentQuestion + 1} of {questions.length}
            </h2>

            <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
              AI Generated
            </span>
          </div>

          <p className="text-lg leading-relaxed">
            {questions.length > 0
              ? questions[currentQuestion]
              : "Loading questions..."}
          </p>
        </div>

        {/* Toggle Editor */}
        <div className="mb-6">
          <button
            onClick={() => setShowEditor(!showEditor)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showEditor
              ? "Hide Coding Editor"
              : "Show Coding Editor"}
          </button>
        </div>

        {/* Monaco Editor */}
        {showEditor && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              Coding Editor
            </h3>

            <CodeEditor
              code={code}
              setCode={setCode}
            />
          </div>
        )}

        {/* Answer Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3">
            Your Answer
          </h3>

          <textarea
            rows="10"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleEndInterview}
            className="border border-gray-400 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            End Interview
          </button>

          <button
            onClick={handleSubmitAnswer}
            disabled={isSubmitted}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-green-400"
          >
            {isSubmitted
              ? "Submitted ✓"
              : "Submit Answer"}
          </button>

          <button
            onClick={handleNextQuestion}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            {currentQuestion === questions.length - 1
              ? "Finish Interview"
              : "Next Question →"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default InterviewRoom;