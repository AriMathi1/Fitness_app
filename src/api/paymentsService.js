import axiosInstance from './axiosConfig';

const API_URL = '/payments';

// Create a payment intent for a booking
const createPaymentIntent = async (data) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/create-intent`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Confirm payment after successful processing
const confirmPayment = async (paymentIntentId) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/confirm`, { paymentIntentId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Process a refund for a payment
const refundPayment = async (paymentId, reason) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/refund`, { paymentId, reason });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get payment history
const getPaymentHistory = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/history`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get payment details
const getPaymentDetails = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const paymentsService = {
  createPaymentIntent,
  confirmPayment,
  refundPayment,
  getPaymentHistory,
  getPaymentDetails
};

export default paymentsService;