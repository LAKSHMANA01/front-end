import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
// import https from "https";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    //withCredentials: true, // Ensures cookies are sent with requests
    headers: {
      "Content-Type": "application/json", // Ensure JSON format
  },

});

// Attach token dynamically
apiClient.interceptors.request.use((config) => {
  try{
    const token = sessionStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
  }catch(error){
    console.error("Error accessing sessionStorage:", error);
  }
    return config;
}, (error) =>{
  return Promise.reject(error);
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
      if (error.response && error.response.status === 401) {
          // Token expired or unauthorized, handle it here
          console.log("Session expired, please log in again.");
          sessionStorage.clear(); // Clear localStorage
          // Redirect to login or show a session expired message
          window.location.href = "/login";
      }
      return Promise.reject(error);
  }
);



export default apiClient;
