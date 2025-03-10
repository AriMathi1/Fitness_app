import axiosInstance from './axiosConfig';

const API_URL = '/trainers';

// Get all trainers with optional filtering
const getTrainers = async (filters = {}) => {
  // Build query string from filters
  const queryParams = new URLSearchParams();
  if (filters.specialty) queryParams.append('specialty', filters.specialty);
  if (filters.availability) queryParams.append('availability', filters.availability);
  if (filters.rating) queryParams.append('rating', filters.rating);
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  const response = await axiosInstance.get(`${API_URL}${queryString}`);
  return response.data;
};

// Get a single trainer by ID
const getTrainer = async (id) => {
  const response = await axiosInstance.get(`${API_URL}/${id}`);
  return response.data;
};

// Get reviews for a trainer
const getTrainerReviews = async (trainerId) => {
  const response = await axiosInstance.get(`${API_URL}/${trainerId}/reviews`);
  return response.data;
};

// Add a review for a trainer
const addTrainerReview = async (trainerId, reviewData) => {
  const response = await axiosInstance.post(`${API_URL}/${trainerId}/reviews`, reviewData);
  return response.data;
};

// Trainer responds to a review
const respondToReview = async (reviewId, response) => {
  const responseData = await axiosInstance.put(`${API_URL}/reviews/${reviewId}/respond`, {
    response
  });
  return responseData.data;
};

const trainersService = {
  getTrainers,
  getTrainer,
  getTrainerReviews,
  addTrainerReview,
  respondToReview
};

export default trainersService;