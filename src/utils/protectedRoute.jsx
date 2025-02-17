import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    if (!token) {
      navigate("/login"); // Redirect to login if no token
    } else if (!allowedRoles.includes(role)) {
      navigate("/unauthorized");
       // Redirect if role is not allowed
    }
  }, [navigate, location, allowedRoles]);

  return <>{children}</>;
};

export default ProtectedRoute;