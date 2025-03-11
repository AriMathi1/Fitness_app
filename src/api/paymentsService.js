import axiosInstance from './axiosConfig';

const API_URL = '/payments';

const createPaymentIntent = async (data) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/create-intent`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const confirmPayment = async (paymentIntentId) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/confirm`, { paymentIntentId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const refundPayment = async (paymentId, reason) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/refund`, { paymentId, reason });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getPaymentHistory = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/history`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

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