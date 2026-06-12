import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();

  // Form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Error message
  const [error, setError] = useState("");

  // Show / Hide password
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(formData);

      // Store JWT token
      localStorage.setItem("token", response.token);
      localStorage.setItem("userName", response.user.name);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-3xl font-bold text-center mb-6">
          Login
        </h1>

        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
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
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;