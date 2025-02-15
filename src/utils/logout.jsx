import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "./apiClient";

const Logout = () => {
    const navigate = useNavigate(); 

    useEffect(() => {
        const handleLogout = async () => {
            try {
                await apiClient.post("/users/logout"); 
                
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("role");
                sessionStorage.removeItem("email");
                
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("email");

                navigate("/login");
            } catch (error) {
                console.error("Logout failed:", error);
            }
        };

        handleLogout();
    }, [navigate]);

    return null; 
};

export default Logout;
