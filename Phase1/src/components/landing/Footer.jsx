import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <p className="font-bold text-lg mb-2">InterviewMate AI</p>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            AI-powered interview preparation platform for developers.
            Practice, code, and get instant feedback.
          </p>
        </div>

        <div>
          <p className="font-semibold text-sm mb-3">Platform</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="#features" className="hover:text-foreground">
                Features
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="hover:text-foreground">
                How It Works
              </a>
            </li>
            <li>
              <Link to="/signup" className="hover:text-foreground">
                Get Started
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-sm mb-3">Company</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="#about" className="hover:text-foreground">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-foreground">
                Contact
              </a>
            </li>
            <li>
              <Link to="/login" className="hover:text-foreground">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} InterviewMate AI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
