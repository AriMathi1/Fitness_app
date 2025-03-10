import axios from 'axios';

// Use environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const AUTH_ENDPOINT = `${API_URL}/auth/`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      // Use x-auth-token header as expected by backend
      config.headers['x-auth-token'] = user.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Register user
const register = async (userData) => {
  try {
    const response = await api.post(AUTH_ENDPOINT + 'register', userData);
    
    if (response.data && response.data.token) {
      // Store both token and user info if available
      const userToStore = {
        token: response.data.token,
        ...(response.data.user && { ...response.data.user })
      };
      localStorage.setItem('user', JSON.stringify(userToStore));
    }
    return response.data;
  } catch (error) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};

// Login user
const login = async (userData) => {
  try {
    const response = await api.post(AUTH_ENDPOINT + 'login', userData);
    
    if (response.data && response.data.token) {
      // Store both token and user info
      const userToStore = {
        token: response.data.token,
        ...(response.data.user && { ...response.data.user })
      };
      localStorage.setItem('user', JSON.stringify(userToStore));
    }
    return response.data;
  } catch (error) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Forgot password
const forgotPassword = async (email) => {
  try {
    const response = await api.post(AUTH_ENDPOINT + 'forgot-password', { email });
    return response.data;
  } catch (error) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};

// Reset password
const resetPassword = async (resetToken, password) => {
  try {
    const response = await api.post(
      AUTH_ENDPOINT + `reset-password/${resetToken}`,
      { password }
    );
    return response.data;
  } catch (error) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};

// Get current user
const getCurrentUser = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
      return null;
    }
    
    const response = await api.get(AUTH_ENDPOINT + 'me');
    return response.data;
  } catch (error) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};

// Helper function to handle API errors
const handleApiError = (error) => {
  // Handle different error responses
  if (error.response && error.response.data) {
    // Handle array of errors from express-validator
    if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
      return error.response.data.errors[0].msg;
    }
    
    // Handle single error message
    if (error.response.data.msg) {
      return error.response.data.msg;
    }
    
    // Handle general message
    if (error.response.data.message) {
      return error.response.data.message;
    }
  }
  
  // Default error message
  return error.message || 'An unexpected error occurred';
};

const authService = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
};

export default authService;