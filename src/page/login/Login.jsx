import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../utils/apiClient";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // State for error message

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        try {
            const response = await apiClient.post(`/users/checkUser`, {
                email,
                password,
            });

            console.log("Response:", response.data);

            if (response.data.success) {
                const { token, email: userEmail, role } = response.data;

                if (!token) {
                    console.error("Token is missing in response");
                    setError("Login failed. Please try again.");
                    return;
                }

                // Store in sessionStorage
                sessionStorage.setItem("token", token);
                sessionStorage.setItem("email", userEmail);
                sessionStorage.setItem("role", role);

                // Redirect to role-based dashboard
                navigate(`/${role}`);
            } else {
                console.error(response.data.error);
                setError(response.data.error); // Store error message in state
                alert(response.data.error); // Show alert message
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Please try again.");
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center bg-gray-100 h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-3xl font-semibold mb-6 text-center">Login</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Show error message */}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-lg font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-lg font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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
        </div>
    );
}

export default Login;
