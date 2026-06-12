import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signupUser } from "../services/authService";

const Signup = () => {
  const navigate = useNavigate();

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Error message
  const [error, setError] = useState("");

  // Show / Hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check passwords match
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
      console.log(error);

      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Signup failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-3xl font-bold text-center mb-6">
          Sign Up
        </h1>

        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
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
              className="w-full border p-2 rounded mt-1"
              required
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
                className="w-full border p-2 rounded mt-1"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-4 text-gray-500"
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Password must contain uppercase,
              lowercase, special character and be
              6-12 characters long.
            </p>
          </div>

          <div className="mb-4">
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
                className="w-full border p-2 rounded mt-1"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-3 top-4 text-gray-500"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;