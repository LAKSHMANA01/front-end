import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "./apiClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await apiClient.post("/users/logout");

      // Clear both sessionStorage & localStorage
      ["token", "role", "email"].forEach((item) => {
        sessionStorage.removeItem(item);
        localStorage.removeItem(item);
      });

      toast.success("Logged out successfully!");
      setTimeout(() => navigate("/login"), 1000); // Small delay to show toast
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      toast.error("Failed to logout. Please try again.");
    }
  }, [navigate]);

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return <ToastContainer position="top-right" autoClose={3000} />;
};

export default Logout;


// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// toast.success("Ticket submitted successfully!");
// toast.success("Ticket submitted successfully!");
// <ToastContainer
// position="top-right"
// autoClose={5000}
// hideProgressBar={false}
// newestOnTop={false}
// closeOnClick
// rtl={false}
// pauseOnFocusLoss
// draggable
// pauseOnHover
// />
