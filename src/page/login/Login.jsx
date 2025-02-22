import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../utils/apiClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { validatePassword, validateEmail } from "../../utils/validation";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const navigate = useNavigate();

    // Handle Email Change with Validation
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (!validateEmail(value)) {
            setEmailError("Invalid email format");
        } else {
            setEmailError(""); // Clear error if valid
        }
    };

    // Handle Password Change with Validation
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (!validatePassword(value)) {
            setPasswordError("Password must be 8-15 chars, include an uppercase, number & special char.");
        } else {
            setPasswordError(""); // Clear error if valid
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (emailError || passwordError) {
            toast.error("Please fix the validation errors before submitting.");
            return;
        }

        try {
            const response = await apiClient.post(`/users/checkUser`, { email, password });

            if (response.data.success) {
                const { token, email: userEmail, role } = response.data;
                if (!token) {
                    toast.error("Login failed. Please try again.");
                    return;
                }

                sessionStorage.setItem("token", token);
                sessionStorage.setItem("email", userEmail);
                sessionStorage.setItem("role", role);

                toast.success("Login successful!");
                setTimeout(() => navigate(`/${role}`), 1000);
            } else {
                toast.error(response.data.error);
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center bg-gray-100 h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-3xl font-semibold mb-6 text-center">Login</h2>

                <form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-lg font-medium mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            value={email}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 
                                ${emailError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                            onChange={handleEmailChange}
                            required
                        />
                        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                    </div>

                    {/* Password Input */}
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-lg font-medium mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            value={password}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 
                                ${passwordError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                            onChange={handlePasswordChange}
                            required
                        />
                        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        disabled={!!emailError || !!passwordError} // Disable if errors exist
                    >
                        Login
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <Link to="/reset" className="text-blue-500 hover:underline text-sm">
                        Forgot Password?
                    </Link>
                </div>
                <p className="mt-4 text-center text-sm">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-500 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
        </div>
    );
}

export default Login;
