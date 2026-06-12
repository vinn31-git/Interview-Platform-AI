import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-4 md:px-8 py-4 border-b bg-white dark:bg-black dark:text-white">
      <h1 className="text-xl md:text-2xl font-bold">
        InterviewMate AI
      </h1>

      <div className="flex gap-4 md:gap-6 text-sm md:text-base">
        <Link
          to="/login"
          className="hover:text-gray-500"
        >
          Login
        </Link>

        <Link
          to="/signup"
          className="hover:text-gray-500"
        >
          Signup
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;