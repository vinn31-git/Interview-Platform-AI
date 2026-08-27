import { Link } from "react-router-dom";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Particles } from "@/components/magicui/particles";
import BlurText from "@/components/reactbits/BlurText";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      <Particles
        className="absolute inset-0"
        quantity={40}
        color="#34d399"
        size={0.4}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <BlurFade delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm mb-8">
            <Sparkles className="w-4 h-4" />
            AI-Powered Interview Preparation Platform
          </div>
        </BlurFade>

        <BlurFade delay={0.2}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1]">
            <BlurText
              text="Master Your Next"
              className="justify-center"
            />
            <br />
            <AnimatedGradientText
              speed={1.2}
              colorFrom="#34d399"
              colorTo="#22d3ee"
              className="text-4xl md:text-6xl lg:text-7xl font-bold"
            >
              Technical Interview
            </AnimatedGradientText>
          </h1>
        </BlurFade>

        <BlurFade delay={0.35}>
          <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Practice with an AI interviewer that speaks questions aloud,
            provides a LeetCode-style coding environment, and delivers
            detailed performance analysis — all in one platform.
          </p>
        </BlurFade>

        <BlurFade delay={0.5}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <ShimmerButton
                background="linear-gradient(135deg, #059669 0%, #0891b2 100%)"
                shimmerColor="#a7f3d0"
                className="text-base font-semibold px-8 py-3"
              >
                Start Free Practice
              </ShimmerButton>
            </Link>
            <a href="#how-it-works">
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                See how it works
                <ArrowRight className="w-4 h-4" />
              </button>
            </a>
          </div>
        </BlurFade>

        <BlurFade delay={0.65}>
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { value: "10+", label: "Interview Types" },
              { value: "5", label: "Languages" },
              { value: "AI", label: "Instant Feedback" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </BlurFade>
      </div>
    </section>
  );
};

export default Hero;
