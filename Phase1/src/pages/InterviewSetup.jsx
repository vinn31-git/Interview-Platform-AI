import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateQuestions } from "../services/interviewService";
import { startInterview } from "../services/interviewHistoryService";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

const InterviewSetup = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [interviewType, setInterviewType] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStartInterview = async () => {
    if (!role || !experience || !difficulty || !interviewType || !duration) {
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

      const isDsa =
        interviewType === "DSA" ||
        interviewType === "DSA + Technical";

      let questionsPayload;

      if (isDsa && response.type === "dsa") {
        localStorage.setItem("interviewMode", "dsa");
        localStorage.setItem(
          "dsaProblem",
          JSON.stringify(response.problem)
        );
        questionsPayload = [response.problem];
      } else {
        localStorage.setItem("interviewMode", "standard");
        localStorage.removeItem("dsaProblem");
        localStorage.setItem(
          "questions",
          JSON.stringify(response.questions)
        );
        questionsPayload = response.questions;
      }

      const interviewResponse = await startInterview({
        role,
        experience,
        difficulty,
        interviewType,
        duration,
        questions: questionsPayload,
      });

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

      localStorage.setItem(
        "interviewId",
        interviewResponse.interview.id
      );

      navigate("/interview-room");
    } catch (error) {
      console.error(error);
      alert("Failed to generate interview questions.");
    } finally {
      setLoading(false);
    }
  };

  const selectClass =
    "w-full border border-border bg-secondary/40 rounded-lg p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="min-h-screen bg-background flex justify-center items-center px-4 py-8">
      <BlurFade className="w-full max-w-xl">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-xl">
          <BorderBeam
            size={200}
            duration={10}
            colorFrom="#10b981"
            colorTo="#06b6d4"
          />

          <h1 className="text-3xl font-bold text-center mb-2">
            Interview Setup
          </h1>
          <p className="text-center text-muted-foreground mb-8 text-sm">
            Configure your mock interview session
          </p>

          <div className="space-y-5">
            <div>
              <label className="block mb-2 font-medium text-sm">
                Job Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={selectClass}
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

            <div>
              <label className="block mb-2 font-medium text-sm">
                Experience Level
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className={selectClass}
              >
                <option value="">Select Experience</option>
                <option>Fresher (0-1 Years)</option>
                <option>Junior (1-3 Years)</option>
                <option>Mid-Level (3-5 Years)</option>
                <option>Senior (5+ Years)</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-sm">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className={selectClass}
              >
                <option value="">Select Difficulty</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-sm">
                Interview Type
              </label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className={selectClass}
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

            <div>
              <label className="block mb-2 font-medium text-sm">
                Interview Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className={selectClass}
              >
                <option value="">Select Duration</option>
                <option>20 Minutes</option>
                <option>30 Minutes</option>
                <option>45 Minutes</option>
                <option>60 Minutes</option>
              </select>
            </div>

            <ShimmerButton
              onClick={handleStartInterview}
              disabled={loading}
              background="linear-gradient(135deg, #059669 0%, #0891b2 100%)"
              shimmerColor="#a7f3d0"
              className="w-full disabled:opacity-50"
            >
              {loading ? "Generating Questions..." : "Start Interview"}
            </ShimmerButton>
          </div>
        </div>
      </BlurFade>
    </div>
  );
};

export default InterviewSetup;
