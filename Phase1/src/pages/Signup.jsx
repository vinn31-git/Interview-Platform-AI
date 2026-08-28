import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signupUser } from "../services/authService";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signupUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      navigate("/login");
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Signup Error:", error.message);
      }

      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Signup failed");
      }
    }
  };

  const inputClass =
    "w-full border border-border bg-secondary/40 p-3 rounded-lg mt-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="min-h-screen bg-background flex justify-center items-center px-4">
      <BlurFade className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-xl">
          <BorderBeam size={180} duration={10} colorFrom="#10b981" colorTo="#06b6d4" />

          <h1 className="text-3xl font-bold text-center mb-6">
            <AnimatedGradientText colorFrom="#34d399" colorTo="#22d3ee">
              Create Account
            </AnimatedGradientText>
          </h1>

          {error && (
            <p className="text-red-400 text-center mb-4 text-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-4">
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                required
                autoComplete="off"
              />
            </div>

            <div className="mb-4">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                required
                autoComplete="off"
              />
            </div>

            <div className="mb-4">
              <label>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass}
                  required
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-4 text-muted-foreground"
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                Password must contain uppercase, lowercase,
                special character and be 6-12 characters long.
              </p>
            </div>

            <div className="mb-6">
              <label>Confirm Password</label>
              <div className="relative">
                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={inputClass}
                  required
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-3 top-4 text-muted-foreground"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>
            </div>

            <ShimmerButton
              type="submit"
              background="linear-gradient(135deg, #059669 0%, #0891b2 100%)"
              shimmerColor="#a7f3d0"
              className="w-full"
            >
              Sign Up
            </ShimmerButton>
          </form>

          <p className="text-center mt-6 text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:text-primary/80"
            >
              Login
            </Link>
          </p>
        </div>
      </BlurFade>
    </div>
  );
};

export default Signup;
