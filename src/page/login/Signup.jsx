import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../utils/apiClient';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [role, setRole] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await apiClient.post('/users/newUser', {
                name,
                email,
                phone,
                address,
                password,
                securityQuestion,
                securityAnswer,
                role
            });

            alert("Registration successful! Please log in.");
            navigate('/login');
        } catch (error) {
            console.error("Signup Error:", error);
            alert("Signup failed. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center bg-gray-100 min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
                <h2 className="text-3xl font-semibold mb-6 text-center">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="mb-4">
                                <label className="block text-lg font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter Name"
                                    autoComplete="off"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-lg font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter Email"
                                    autoComplete="off"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-lg font-medium mb-2">Phone</label>
                                <input
                                    type="tel"
                                    placeholder="Enter Phone Number"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-lg font-medium mb-2">Address</label>
                                <input
                                    type="text"
                                    placeholder="Enter Address"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="mb-4">
                                <label className="block text-lg font-medium mb-2">Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter Password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-lg font-medium mb-2">Security Question</label>
                                <input
                                    type="text"
                                    placeholder="Enter a security question"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={securityQuestion}
                                    onChange={(e) => setSecurityQuestion(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-lg font-medium mb-2">Security Answer</label>
                                <input
                                    type="text"
                                    placeholder="Enter your security answer"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={securityAnswer}
                                    onChange={(e) => setSecurityAnswer(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-lg font-medium mb-2">Role</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select your role</option>
                                    <option value="engineer">Engineer</option>
                                    <option value="user">User</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Signup;
