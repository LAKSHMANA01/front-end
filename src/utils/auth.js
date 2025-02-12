import apiClient from './apiClient'; // Import the apiClient

export const logout = async (navigate) => {
    try {
        // Call backend to log out (it will just confirm logout, no cookies are involved)
        await apiClient.post('/users/logout'); 

        // Clear the localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');

        // Redirect to login page
        navigate('/login');
    } catch (error) {
        console.error("Logout failed:", error);
    }
};
