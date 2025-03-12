import axiosInstance from './axiosConfig';

const API_URL = '/bookings';

const getBookings = async (params = {}) => {
  try {
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

const getBooking = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createBooking = async (bookingData) => {
  try {
    const response = await axiosInstance.post(API_URL, bookingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const cancelBooking = async (id) => {
  try {
    console.log('API service: Cancelling booking with ID:', id);
    const response = await axiosInstance.put(`${API_URL}/${id}`, { 
      status: 'cancelled' 
    });
    console.log('API service: Cancel booking response:', response.data);
    
    if (response.data.status !== 'cancelled') {
      console.error('API returned success but booking status is not cancelled:', response.data.status);
    }
    
    return response.data;
  } catch (error) {
    console.error('API service: Error cancelling booking:', error);
    throw error;
  }
};

const getTrainerBookings = async (params = {}) => {
  try {
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