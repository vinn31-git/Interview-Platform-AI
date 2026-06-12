import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateQuestions } from "../services/interviewService";

const InterviewSetup = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [interviewType, setInterviewType] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStartInterview = async () => {
    if (
      !role ||
      !experience ||
      !difficulty ||
      !interviewType ||
      !duration
    ) {
      alert("Please fill all fields before starting the interview.");
      return;
    }

    try {
      setLoading(true);

      const response = await generateQuestions({
        role,
        experience,
        difficulty,
        interviewType,
      });

      localStorage.setItem(
        "questions",
        JSON.stringify(response.questions)
      );

      localStorage.setItem(
        "interviewDetails",
        JSON.stringify({
          role,
          experience,
          difficulty,
          interviewType,
          duration,
        })
      );

      navigate("/interview-room");
    } catch (error) {
      console.error(error);
      alert("Failed to generate interview questions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Interview Setup
        </h1>

        <div className="space-y-5">

          {/* Role */}
          <div>
            <label className="block mb-2 font-medium">
              Job Role
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select Role</option>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>SDE/SWE</option>
              <option>Java Developer</option>
              <option>Python Developer</option>
              <option>Data Analyst</option>
              <option>DevOps Engineer</option>
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="block mb-2 font-medium">
              Experience Level
            </label>

            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select Experience</option>
              <option>Fresher (0-1 Years)</option>
              <option>Junior (1-3 Years)</option>
              <option>Mid-Level (3-5 Years)</option>
              <option>Senior (5+ Years)</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block mb-2 font-medium">
              Difficulty Level
            </label>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select Difficulty</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          {/* Interview Type */}
          <div>
            <label className="block mb-2 font-medium">
              Interview Type
            </label>

            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select Interview Type</option>
              <option>DSA</option>
              <option>HR</option>
              <option>Technical</option>
              <option>System Design</option>
              <option>HR + Technical</option>
              <option>DSA + Technical</option>
              <option>Complete Interview</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block mb-2 font-medium">
              Interview Duration
            </label>

            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select Duration</option>
              <option>20 Minutes</option>
              <option>30 Minutes</option>
              <option>45 Minutes</option>
              <option>60 Minutes</option>
            </select>
          </div>

          {/* Button */}
          <button
            onClick={handleStartInterview}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-500"
          >
            {loading
              ? "Generating Questions..."
              : "Start Interview"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;