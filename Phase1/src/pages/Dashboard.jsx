import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const userName =
    localStorage.getItem("userName") || "Candidate";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          AI Interview Platform
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-4xl mx-auto mt-10">
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-3xl font-bold mb-3">
            Welcome, {userName}
          </h2>

          <p className="text-gray-600 mb-6">
            Ready to practice your interview skills?
          </p>

          <button
            onClick={() =>
              navigate("/interview-setup")
            }
            className="bg-black text-white px-6 py-3 rounded"
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;