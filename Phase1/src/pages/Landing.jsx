import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import About from "../components/landing/About";
import Contact from "../components/landing/Contact";
import Footer from "../components/landing/Footer";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

const Landing = () => {
  return (
    <div className="bg-background">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <About />

      {/* CTA section */}
      <section className="py-24 px-4">
        <BlurFade>
          <div className="max-w-3xl mx-auto text-center p-10 rounded-2xl border border-border bg-card">
            <h2 className="text-3xl font-bold mb-4">
              Ready to ace your next interview?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join InterviewMate AI and start practicing with realistic
              AI-powered mock interviews today.
            </p>
            <Link to="/signup">
              <ShimmerButton
                background="linear-gradient(135deg, #059669 0%, #0891b2 100%)"
                shimmerColor="#a7f3d0"
                className="text-base font-semibold px-8"
              >
                Create Free Account
              </ShimmerButton>
            </Link>
          </div>
        </BlurFade>
      </section>

      <Contact />
      <Footer />
    </div>
  );
};

export default Landing;
