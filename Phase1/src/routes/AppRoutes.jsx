import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import InterviewSetup from "../pages/InterviewSetup";
import InterviewRoom from "../pages/InterviewRoom";
import Results from "../pages/Results";

import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/interview-setup"
        element={
          <ProtectedRoute>
            <InterviewSetup />
          </ProtectedRoute>
        }
      />

      <Route
        path="/interview-room"
        element={
          <ProtectedRoute>
            <InterviewRoom />
          </ProtectedRoute>
        }
      />

      <Route
        path="/results"
        element={
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;