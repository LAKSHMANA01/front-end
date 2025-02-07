import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // Default role
    
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post('http://localhost:3001/login', { email, password })
            .then((role)=>{

            })
            .catch((err) => console.log(err));
            
            if (role === 'user') {
                navigate('/User');
              } else if (role === 'engineer') {
                navigate('/engineer');
              } else if (role === 'admin') {
                navigate('/admin');
              }
    };

    return (
        <div className="flex justify-center items-center bg-gray-100 h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-3xl font-semibold mb-6 text-center">Login</h2>
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
                    <div>
                    <label htmlFor="password" className="block text-lg font-medium mb-2">
                            Role
                        </label>


                    <select className='w-60 mb-5' value={role} onChange={(e) => setRole(e.target.value)}>
                         <option value="user">User</option>
                         <option value="engineer">Engineer</option>
                         <option value="admin">Admin</option>
                     </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-sm">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="text-blue-500 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
