import axiosInstance from './axiosConfig';

const API_URL = '/profile';

// Get user profile
const getProfile = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user profile
const updateProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put(API_URL, profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const profileService = {
  getProfile,
  updateProfile
};

export default profileService;