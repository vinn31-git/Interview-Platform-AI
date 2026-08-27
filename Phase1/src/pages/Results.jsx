import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { evaluateInterview } from "../services/evaluationService";
import {
  getInterviewById,
  saveInterviewResults,
} from "../services/interviewHistoryService";
import { BlurFade } from "@/components/magicui/blur-fade";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const verdictColor = {
  "Strong Hire": "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  Hire: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
  "Lean Hire": "text-amber-400 bg-amber-500/10 border-amber-500/30",
  "No Hire": "text-red-400 bg-red-500/10 border-red-500/30",
  "Strong No Hire": "text-red-500 bg-red-500/10 border-red-500/30",
};

const ScoreCard = ({ label, score, delay = 0 }) => (
  <BlurFade delay={delay}>
    <Card className="p-5 text-center border-border/60 bg-card">
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <p className="text-3xl font-bold text-primary">
        <NumberTicker value={score} />
        <span className="text-lg text-muted-foreground">/10</span>
      </p>
    </Card>
  </BlurFade>
);

const Results = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        if (id) {
          const response = await getInterviewById(id);
          if (response.interview?.evaluation) {
            setEvaluation(response.interview.evaluation);
            return;
          }
        }

        const answers = JSON.parse(
          localStorage.getItem("answers") || "[]"
        );

        if (answers.length === 0) {
          setError("No answers found. Complete an interview first.");
          return;
        }

        const interviewDetails = JSON.parse(
          localStorage.getItem("interviewDetails") || "{}"
        );

        const response = await evaluateInterview({
          role: interviewDetails.role,
          experience: interviewDetails.experience,
          difficulty: interviewDetails.difficulty,
          interviewType: interviewDetails.interviewType,
          answers,
        });

        setEvaluation(response.evaluation);

        const interviewId = localStorage.getItem("interviewId");
        if (interviewId) {
          await saveInterviewResults(interviewId, {
            answers,
            evaluation: response.evaluation,
            score: Math.round(response.evaluation.overallScore * 10),
          });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to generate evaluation. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background gap-4">
        <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <BlurFade>
          <h1 className="text-xl font-semibold text-foreground">
            Analyzing your interview performance...
          </h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Evaluating answers, code quality, and communication
          </p>
        </BlurFade>
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background gap-4 px-4">
        <p className="text-muted-foreground">{error || "No data available."}</p>
        <ShimmerButton
          onClick={() => navigate("/dashboard")}
          background="linear-gradient(135deg, #059669 0%, #0891b2 100%)"
          shimmerColor="#a7f3d0"
        >
          Back to Dashboard
        </ShimmerButton>
      </div>
    );
  }

  const overallPercent = Math.round(evaluation.overallScore * 10);
  const verdictStyle =
    verdictColor[evaluation.verdict] || verdictColor["Lean Hire"];

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <BlurFade>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-center">
            <BorderBeam
              size={300}
              duration={14}
              colorFrom="#10b981"
              colorTo="#06b6d4"
            />

            <Badge className="mb-4" variant="secondary">
              AI Evaluation Report
            </Badge>

            <h1 className="text-3xl font-bold mb-2">Interview Results</h1>

            <p className="text-6xl font-bold text-primary my-4">
              <NumberTicker value={overallPercent} />%
            </p>

            {evaluation.verdict && (
              <span
                className={`inline-block text-sm px-3 py-1 rounded-full border font-medium ${verdictStyle}`}
              >
                {evaluation.verdict}
              </span>
            )}

            {evaluation.summary && (
              <p className="mt-6 text-left text-muted-foreground leading-relaxed text-sm">
                {evaluation.summary}
              </p>
            )}
          </div>
        </BlurFade>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ScoreCard label="Technical" score={evaluation.technicalScore} delay={0.1} />
          <ScoreCard label="Communication" score={evaluation.communicationScore} delay={0.15} />
          <ScoreCard label="Problem Solving" score={evaluation.problemSolvingScore || 0} delay={0.2} />
          <ScoreCard label="Code Quality" score={evaluation.codeQualityScore || 0} delay={0.25} />
        </div>

        <BlurFade delay={0.3}>
          <Card className="p-6 border-border/60">
            <h3 className="text-lg font-bold mb-4 text-emerald-400">Strengths</h3>
            <ul className="space-y-2">
              {evaluation.strengths?.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-emerald-400 shrink-0">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </Card>
        </BlurFade>

        <BlurFade delay={0.35}>
          <Card className="p-6 border-border/60">
            <h3 className="text-lg font-bold mb-4 text-amber-400">
              Areas for Improvement
            </h3>
            <ul className="space-y-2">
              {evaluation.improvements?.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-amber-400 shrink-0">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </BlurFade>

        {evaluation.recommendations?.length > 0 && (
          <BlurFade delay={0.4}>
            <Card className="p-6 border-border/60">
              <h3 className="text-lg font-bold mb-4 text-cyan-400">
                Recommendations
              </h3>
              <ul className="space-y-2">
                {evaluation.recommendations.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-cyan-400 shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </BlurFade>
        )}

        {evaluation.questionBreakdown?.length > 0 && (
          <BlurFade delay={0.45}>
            <Card className="p-6 border-border/60">
              <h3 className="text-lg font-bold mb-4">Question Breakdown</h3>
              <div className="space-y-4">
                {evaluation.questionBreakdown.map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-border/50 bg-secondary/20"
                  >
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <p className="font-medium text-sm">
                        Q{i + 1}. {item.question}
                      </p>
                      <Badge variant="secondary">{item.score}/10</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.feedback}</p>
                    {item.codeReview && (
                      <p className="text-sm text-primary/80 mt-2 font-mono bg-secondary/30 p-2 rounded">
                        Code: {item.codeReview}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </BlurFade>
        )}

        <BlurFade delay={0.5}>
          <ShimmerButton
            onClick={() => navigate("/dashboard")}
            background="linear-gradient(135deg, #059669 0%, #0891b2 100%)"
            shimmerColor="#a7f3d0"
            className="w-full"
          >
            Back to Dashboard
          </ShimmerButton>
        </BlurFade>
      </div>
    </div>
  );
};

export default Results;
