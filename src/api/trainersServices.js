import axiosInstance from './axiosConfig';

const API_URL = '/trainers';

const getTrainers = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.specialty) queryParams.append('specialty', filters.specialty);
  if (filters.availability) queryParams.append('availability', filters.availability);
  if (filters.rating) queryParams.append('rating', filters.rating);
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  const response = await axiosInstance.get(`${API_URL}${queryString}`);
  return response.data;
};

const getTrainer = async (id) => {
  const response = await axiosInstance.get(`${API_URL}/${id}`);
  return response.data;
};

const getTrainerReviews = async (trainerId) => {
  const response = await axiosInstance.get(`${API_URL}/${trainerId}/reviews`);
  return response.data;
};

const addTrainerReview = async (trainerId, reviewData) => {
  const response = await axiosInstance.post(`${API_URL}/${trainerId}/reviews`, reviewData);
  return response.data;
};

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