import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { verifyToken } from "../services/authService";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await verifyToken();
        localStorage.setItem("userName", response.user.name);
        setStatus("authenticated");
      } catch {
        localStorage.removeItem("userName");
        setStatus("unauthenticated");
      }
    };

    checkAuth();
  }, []);

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
