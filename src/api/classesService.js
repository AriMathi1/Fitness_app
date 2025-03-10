import axiosInstance from './axiosConfig';

const API_URL = '/classes';

// Get all classes with filtering
const getClasses = async (filters = {}) => {
  // Build query string from filters
  const queryParams = new URLSearchParams();
  if (filters.type) queryParams.append('type', filters.type);
  if (filters.location) queryParams.append('location', filters.location);
  if (filters.trainerId) queryParams.append('trainerId', filters.trainerId);
  if (filters.search) queryParams.append('search', filters.search);
  
  const response = await axiosInstance.get(`${API_URL}?${queryParams.toString()}`);
  return response.data;
};

// Get class by ID
const getClass = async (classId) => {
  const response = await axiosInstance.get(`${API_URL}/${classId}`);
  return response.data;
};

// Create a new class (trainers only)
const createClass = async (classData) => {
  const response = await axiosInstance.post(API_URL, classData);
  return response.data;
};

// Update a class (trainers only)
const updateClass = async (classId, classData) => {
  const response = await axiosInstance.put(`${API_URL}/${classId}`, classData);
  return response.data;
};

// Delete a class (trainers only)
const deleteClass = async (classId) => {
  const response = await axiosInstance.delete(`${API_URL}/${classId}`);
  return response.data;
};

// Get classes by trainer
const getTrainerClasses = async (trainerId) => {
  const response = await axiosInstance.get(`${API_URL}/trainer/${trainerId}`);
  return response.data;
};

// Get personalized class recommendations
const getRecommendations = async (limit = 5) => {
  const response = await axiosInstance.get(`/recommendations/classes?limit=${limit}`);
  return response.data;
};

const classesService = {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
  getTrainerClasses,
  getRecommendations
};

export default classesService;