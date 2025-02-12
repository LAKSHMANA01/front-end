import React, { useState } from 'react';
import apiClient from '../../utils/apiClient';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    // 🔹 Reusable API request function
    const sendResetRequest = async (data, onSuccess, errorMessage) => {
        try {
            const response = await apiClient.post('/users/reset', data);
            if (response.data.success) {
                onSuccess(response.data);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert(error.response?.data?.message || errorMessage);
        }
    };

    // ✅ Step 1: Handle Email Verification
    const handleEmailSubmit = (e) => {
        e.preventDefault();
        sendResetRequest(
            { email },
            (data) => {
                setSecurityQuestion(data.securityQuestion);
                setStep(2);
            },
            "Error verifying email"
        );
    };

    // ✅ Step 2: Handle Security Answer Verification
    const handleSecurityAnswerSubmit = (e) => {
        e.preventDefault();
        sendResetRequest(
            { email, securityAnswer: securityAnswer.trim() },
            () => setStep(3),
            "Error verifying security answer"
        );
    };

    // ✅ Step 3: Handle Password Reset
    const handlePasswordReset = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        sendResetRequest(
            { email, newPassword },
            () => {
                alert("Password reset successfully!");
                navigate('/login');
            },
            "Error resetting password"
        );
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

                {/* Step 1: Verify Email */}
                {step === 1 && (
                    <form onSubmit={handleEmailSubmit}>
                        <label className="block mb-2">Enter Email</label>
                        <input 
                            type="email" 
                            className="w-full p-2 border rounded" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                        <button type="submit" className="w-full mt-4 bg-blue-500 text-white py-2 rounded">
                            Verify Email
                        </button>
                    </form>
                )}

                {/* Step 2: Verify Security Answer */}
                {step === 2 && (
                    <form onSubmit={handleSecurityAnswerSubmit}>
                        <p className="mb-2">{securityQuestion}</p>
                        <input 
                            type="text" 
                            className="w-full p-2 border rounded" 
                            value={securityAnswer} 
                            onChange={(e) => setSecurityAnswer(e.target.value)} 
                            required 
                        />
                        <button type="submit" className="w-full mt-4 bg-blue-500 text-white py-2 rounded">
                            Verify Answer
                        </button>
                    </form>
                )}

                {/* Step 3: Reset Password */}
                {step === 3 && (
                    <form onSubmit={handlePasswordReset}>
                        <label className="block mb-2">New Password</label>
                        <input 
                            type="password" 
                            className="w-full p-2 border rounded" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            required 
                        />
                        <label className="block mb-2 mt-4">Confirm Password</label>
                        <input 
                            type="password" 
                            className="w-full p-2 border rounded" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                        />
                        <button type="submit" className="w-full mt-4 bg-green-500 text-white py-2 rounded">
                            Reset Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
