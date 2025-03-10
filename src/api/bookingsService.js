import axiosInstance from './axiosConfig';

const API_URL = '/bookings';

// Get user bookings
const getBookings = async (params = {}) => {
  try {
    // Build query string for filtering
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.upcoming) queryParams.append('upcoming', params.upcoming);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await axiosInstance.get(`${API_URL}${queryString}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get single booking
const getBooking = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new booking
const createBooking = async (bookingData) => {
  try {
    const response = await axiosInstance.post(API_URL, bookingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cancel booking (for clients)
const cancelBooking = async (id) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, { 
      status: 'cancelled' 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get trainer bookings
const getTrainerBookings = async (params = {}) => {
  try {
    // Build query string for filtering
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.upcoming) queryParams.append('upcoming', params.upcoming);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await axiosInstance.get(`${API_URL}/trainer${queryString}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update booking status (for trainers)
const updateBookingStatus = async (id, status) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/trainer/${id}`, { 
      status,
      notes: status === 'cancelled' ? 'Cancelled by trainer' : ''
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get booking statistics (for dashboard)
const getBookingStats = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/stats`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const bookingsService = {
  getBookings,
  getBooking,
  createBooking,
  cancelBooking,
  getTrainerBookings,
  updateBookingStatus,
  getBookingStats
};

export default bookingsService;