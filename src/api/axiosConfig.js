import axios from 'axios';

// This is the fixed line - properly accessing the environment variable
const baseURL = import.meta.env.VITE_API_URL;

// Add debugging log
console.log("API Base URL:", baseURL);

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const userStr = localStorage.getItem('user');
      console.log("User string from localStorage:", userStr ? "Found" : "Not found");
      
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log("User parsed:", user ? "Successfully" : "Failed");
        
        if (user && user.token) {
          // Set the header exactly as expected by your backend
          config.headers['x-auth-token'] = user.token;
          console.log("Token applied to request header");
        } else {
          console.log("No token found in user object");
        }
      } else {
        console.log("No user found in localStorage");
      }
    } catch (error) {
      console.error("Error in request interceptor:", error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration - you might want to refresh token here
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      console.log("401 Unauthorized error - logging out user");
      // Handle token issues or logout user
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;