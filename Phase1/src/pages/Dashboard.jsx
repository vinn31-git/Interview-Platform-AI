import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDashboardStats,
  getInterviewHistory,
} from "../services/interviewHistoryService";
import { BlurFade } from "@/components/magicui/blur-fade";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Candidate";

  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    bestScore: 0,
    mostPracticedRole: null,
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, historyResponse] = await Promise.all([
          getDashboardStats(),
          getInterviewHistory(),
        ]);
        setStats(statsResponse.stats);
        setHistory(historyResponse.interviews);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-md px-4 py-3 flex justify-between items-center">
        <span className="text-lg font-bold text-primary">InterviewMate AI</span>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        <BlurFade>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8">
            <BorderBeam size={250} duration={12} colorFrom="#10b981" colorTo="#06b6d4" />
            <h2 className="text-3xl font-bold mb-2">Welcome, {userName}</h2>
            <p className="text-muted-foreground mb-6">
              Track your progress and start a new mock interview.
            </p>
            <ShimmerButton
              onClick={() => navigate("/interview-setup")}
              background="linear-gradient(135deg, #059669 0%, #0891b2 100%)"
              shimmerColor="#a7f3d0"
            >
              Start New Interview
            </ShimmerButton>
          </div>
        </BlurFade>

        <BlurFade delay={0.15}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Interviews", value: stats.totalInterviews, suffix: "" },
              { label: "Average Score", value: stats.averageScore, suffix: "%" },
              { label: "Best Score", value: stats.bestScore, suffix: "%" },
              { label: "Top Role", value: stats.mostPracticedRole || "—", isText: true },
            ].map((item) => (
              <Card key={item.label} className="p-6 text-center border-border/60">
                <p className="text-sm text-muted-foreground mb-2">{item.label}</p>
                {item.isText ? (
                  <p className="text-xl font-bold truncate">{item.value}</p>
                ) : (
                  <p className="text-3xl font-bold text-primary">
                    <NumberTicker value={item.value} />
                    {item.suffix}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </BlurFade>

        <BlurFade delay={0.25}>
          <Card className="p-6 border-border/60">
            <h3 className="text-xl font-bold mb-6">Interview History</h3>
            {loading ? (
              <p className="text-muted-foreground">Loading history...</p>
            ) : history.length === 0 ? (
              <p className="text-muted-foreground">
                No interviews yet. Start your first mock interview!
              </p>
            ) : (
              <div className="space-y-3">
                {history.map((interview, index) => (
                  <BlurFade key={interview.id} delay={0.05 * index}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/60 bg-secondary/20 hover:bg-secondary/40 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{interview.role}</p>
                          <Badge variant="secondary">{interview.difficulty}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {interview.interviewType} · {interview.duration} ·{" "}
                          {formatDate(interview.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {interview.score != null ? (
                          <span className="text-lg font-bold text-primary">
                            {interview.score}%
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Pending</span>
                        )}
                        {interview.score != null && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/results/${interview.id}`)}
                          >
                            View Report
                          </Button>
                        )}
                      </div>
                    </div>
                  </BlurFade>
                ))}
              </div>
            )}
          </Card>
        </BlurFade>
      </div>
    </div>
  );
};

export default Dashboard;
