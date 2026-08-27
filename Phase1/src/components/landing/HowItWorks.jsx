import { BlurFade } from "@/components/magicui/blur-fade";

const steps = [
  {
    step: "01",
    title: "Configure Your Interview",
    description:
      "Choose your role, experience level, difficulty, interview type, and session duration.",
  },
  {
    step: "02",
    title: "AI Generates Questions",
    description:
      "Our AI creates tailored questions — from DSA problems with constraints and examples to HR and system design prompts.",
  },
  {
    step: "03",
    title: "Practice in Real Time",
    description:
      "The AI interviewer speaks each question. Code in the built-in IDE, explain your approach verbally, and run test cases.",
  },
  {
    step: "04",
    title: "Get Your Report",
    description:
      "Receive a detailed evaluation with scores, strengths, improvements, code review, and actionable recommendations.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <BlurFade>
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-primary mb-3">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Four steps to interview readiness
            </h2>
          </div>
        </BlurFade>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <BlurFade key={item.step} delay={0.1 * index}>
              <div className="relative">
                <span className="text-5xl font-bold text-primary/20">
                  {item.step}
                </span>
                <h3 className="text-lg font-semibold mt-2 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
