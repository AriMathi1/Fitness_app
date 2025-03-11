import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const AUTH_ENDPOINT = `${API_URL}/auth/`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers['x-auth-token'] = user.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const register = async (userData) => {
  try {
    const response = await api.post(AUTH_ENDPOINT + 'register', userData);
    
    if (response.data && response.data.token) {
      const userToStore = {
        token: response.data.token
      };
      
      if (response.data.user) {
        userToStore.id = response.data.user.id;
        userToStore.name = response.data.user.name;
        userToStore.email = response.data.user.email;
        userToStore.userType = response.data.user.userType;
      }
      
      localStorage.setItem('user', JSON.stringify(userToStore));
      console.log('Stored user data:', userToStore); // Debug log
    }
    return response.data;
  } catch (error) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};

const login = async (userData) => {
  try {
    const response = await api.post(AUTH_ENDPOINT + 'login', userData);
    
    if (response.data && response.data.token) {
      const userToStore = {
        token: response.data.token
      };
      
      if (response.data.user) {
        userToStore.id = response.data.user.id;
        userToStore.name = response.data.user.name;
        userToStore.email = response.data.user.email;
        userToStore.userType = response.data.user.userType;
      }
      
      localStorage.setItem('user', JSON.stringify(userToStore));
      console.log('Stored user data after login:', userToStore); 
    }
    return response.data;
  } catch (error) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};

const logout = () => {
  localStorage.removeItem('user');
};

const forgotPassword = async (email) => {
  try {
    const response = await api.post(AUTH_ENDPOINT + 'forgot-password', { email });
    return response.data;
  } catch (error) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};

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

const handleApiError = (error) => {
  if (error.response && error.response.data) {
    if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
      return error.response.data.errors[0].msg;
    }
    
    if (error.response.data.msg) {
      return error.response.data.msg;
    }
    
    if (error.response.data.message) {
      return error.response.data.message;
    }
  }
  
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