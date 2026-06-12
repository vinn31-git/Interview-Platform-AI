import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-white text-black dark:bg-black dark:text-white">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Ace Your Interviews With AI
      </h1>

      <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
        Practice technical interviews with AI-generated questions and get
        instant feedback on your performance.
      </p>

      <Link
        to="/interview-setup"
        className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-lg hover:opacity-90 transition"
      >
        Start Interview
      </Link>
    </section>
  );
};

export default Hero;