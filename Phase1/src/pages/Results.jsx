import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { evaluateInterview } from "../services/evaluationService";

const Results = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const answers = JSON.parse(
          localStorage.getItem("answers")
        );

        const interviewDetails = JSON.parse(
          localStorage.getItem("interviewDetails")
        );

        const response = await evaluateInterview({
          role: interviewDetails.role,
          answers,
        });

        setEvaluation(response.evaluation);
      } catch (error) {
        console.error(error);
        alert("Failed to generate evaluation.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-2xl font-semibold">
          Generating AI Evaluation...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-8">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">

        <h1 className="text-4xl font-bold text-center mb-2">
          Interview Results
        </h1>

        <p className="text-center text-gray-500 mb-8">
          AI Evaluation Report
        </p>

        <div className="text-center mb-8">
          <h2 className="text-6xl font-bold">
            {evaluation.overallScore * 10}%
          </h2>

          <p className="text-gray-500 mt-2">
            Overall Score
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">

          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <h3 className="font-semibold">
              Technical
            </h3>

            <p className="text-2xl font-bold mt-2">
              {evaluation.technicalScore}/10
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <h3 className="font-semibold">
              Communication
            </h3>

            <p className="text-2xl font-bold mt-2">
              {evaluation.communicationScore}/10
            </p>
          </div>

        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3">
            Strengths
          </h3>

          <ul className="list-disc ml-6 space-y-2">
            {evaluation.strengths.map(
              (strength, index) => (
                <li key={index}>
                  {strength}
                </li>
              )
            )}
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-3">
            Areas for Improvement
          </h3>

          <ul className="list-disc ml-6 space-y-2">
            {evaluation.improvements.map(
              (item, index) => (
                <li key={index}>
                  {item}
                </li>
              )
            )}
          </ul>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
};

export default Results;