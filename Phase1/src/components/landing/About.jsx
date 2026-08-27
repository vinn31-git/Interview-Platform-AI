import { BlurFade } from "@/components/magicui/blur-fade";

const About = () => {
  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <BlurFade>
          <div>
            <p className="text-sm uppercase tracking-widest text-primary mb-3">
              About
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Built for developers, by developers
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                InterviewMate AI is a full-stack interview preparation platform
                that simulates real technical interviews using AI. Whether
                you're preparing for your first SDE role or leveling up to
                senior, our platform adapts to your experience and target role.
              </p>
              <p>
                We combine Groq LLM for intelligent question generation and
                evaluation, Judge0 for secure multi-language code execution,
                and modern web technologies to deliver a seamless practice
                experience from setup to detailed feedback.
              </p>
            </div>
          </div>
        </BlurFade>

        <BlurFade delay={0.15}>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Tech Stack", value: "React + Node.js" },
              { label: "AI Engine", value: "Groq LLM" },
              { label: "Code Runner", value: "Judge0 API" },
              { label: "Database", value: "PostgreSQL" },
              { label: "Auth", value: "JWT + bcrypt" },
              { label: "Editor", value: "Monaco" },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-xl border border-border bg-card"
              >
                <p className="text-xs text-muted-foreground mb-1">
                  {item.label}
                </p>
                <p className="font-semibold text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </BlurFade>
      </div>
    </section>
  );
};

export default About;
