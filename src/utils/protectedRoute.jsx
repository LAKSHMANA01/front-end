import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const role=sessionStorage.getItem('role');
        if (!token) {
            navigate('/login'); // Redirect to login if no token
        }
    }, [navigate]);

    return <>{children}</>;
};

export default ProtectedRoute;
