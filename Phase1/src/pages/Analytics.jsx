import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  getDashboardStats,
  getInterviewHistory,
} from "../services/interviewHistoryService";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const COLORS = ["#10b981", "#06b6d4", "#f59e0b", "#ef4444", "#8b5cf6"];

const Analytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          getDashboardStats(),
          getInterviewHistory(),
        ]);
        setStats(statsRes.stats);
        setHistory(historyRes.interviews.reverse()); // Chronological for charts
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const performanceData = useMemo(() => {
    return history
      .filter((h) => h.score != null)
      .map((h, i) => ({
        name: `Int ${i + 1}`,
        score: h.score,
        role: h.role,
        date: new Date(h.createdAt).toLocaleDateString(),
      }));
  }, [history]);

  const roleDistribution = useMemo(() => {
    const counts = {};
    history.forEach((h) => {
      counts[h.role] = (counts[h.role] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [history]);

  const typeDistribution = useMemo(() => {
    const counts = {};
    history.forEach((h) => {
      counts[h.interviewType] = (counts[h.interviewType] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [history]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <p className="text-muted-foreground">Loading Analytics...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-4">
        <p className="text-muted-foreground">
          No interview data available for analytics yet.
        </p>
        <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-md px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
            &larr; Back
          </Button>
          <span className="text-lg font-bold text-primary">Analytics Dashboard</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <BlurFade>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6">
            <BorderBeam size={200} duration={12} colorFrom="#10b981" colorTo="#06b6d4" />
            <h2 className="text-2xl font-bold mb-2">Performance Insights</h2>
            <p className="text-muted-foreground text-sm">
              Visualize your mock interview progression and identify areas for improvement.
            </p>
          </div>
        </BlurFade>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Performance Trend */}
          <BlurFade delay={0.1}>
            <Card className="p-6 border-border/60 bg-card/50">
              <h3 className="text-lg font-semibold mb-6">Score Progression</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111", borderColor: "#333" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#10b981" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </BlurFade>

          {/* Role Distribution */}
          <BlurFade delay={0.2}>
            <Card className="p-6 border-border/60 bg-card/50">
              <h3 className="text-lg font-semibold mb-6">Interviews by Role</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roleDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {roleDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111", borderColor: "#333" }}
                      itemStyle={{ color: "#fff" }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </BlurFade>

          {/* Type Distribution */}
          <BlurFade delay={0.3}>
            <Card className="p-6 border-border/60 bg-card/50 lg:col-span-2">
              <h3 className="text-lg font-semibold mb-6">Interview Types</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111", borderColor: "#333" }}
                      cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    />
                    <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </BlurFade>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
