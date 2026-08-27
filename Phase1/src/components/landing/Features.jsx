import { BlurFade } from "@/components/magicui/blur-fade";
import {
  Brain,
  Code2,
  Mic,
  BarChart3,
  Timer,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Question Generation",
    description:
      "Groq-powered LLM generates role-specific questions across DSA, HR, Technical, and System Design interviews.",
  },
  {
    icon: Mic,
    title: "Voice-Enabled Interviews",
    description:
      "The AI interviewer speaks questions aloud and accepts speech-to-text answers for a natural interview feel.",
  },
  {
    icon: Code2,
    title: "LeetCode-Style IDE",
    description:
      "Split-screen layout with problem description on the left and a Monaco code editor on the right. Run code in 5 languages.",
  },
  {
    icon: BarChart3,
    title: "Detailed AI Analysis",
    description:
      "Get scored feedback on technical skills, communication, problem-solving, and code quality with per-question breakdowns.",
  },
  {
    icon: Timer,
    title: "Timed Sessions",
    description:
      "Configurable interview durations from 20 to 60 minutes with a live countdown timer.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "JWT authentication, encrypted passwords, and your interview history stored securely in PostgreSQL.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <BlurFade>
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-primary mb-3">
              Features
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to prepare
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From question generation to final evaluation — a complete
              interview preparation workflow built for developers.
            </p>
          </div>
        </BlurFade>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <BlurFade key={feature.title} delay={0.05 * index}>
              <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors h-full">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
