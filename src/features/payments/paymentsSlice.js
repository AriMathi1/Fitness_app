import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import paymentsService from '../../api/paymentsService';

const initialState = {
  payments: [],
  currentPayment: null,
  paymentIntent: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

// Create payment intent
export const createPaymentIntent = createAsyncThunk(
  'payments/createIntent',
  async (data, thunkAPI) => {
    try {
      return await paymentsService.createPaymentIntent(data);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          (error.response.data.message || error.response.data.msg)) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Confirm payment
export const confirmPayment = createAsyncThunk(
  'payments/confirm',
  async (paymentIntentId, thunkAPI) => {
    try {
      return await paymentsService.confirmPayment(paymentIntentId);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          (error.response.data.message || error.response.data.msg)) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Process refund
export const refundPayment = createAsyncThunk(
  'payments/refund',
  async ({ paymentId, reason }, thunkAPI) => {
    try {
      return await paymentsService.refundPayment(paymentId, reason);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          (error.response.data.message || error.response.data.msg)) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get payment history
export const getPaymentHistory = createAsyncThunk(
  'payments/getHistory',
  async (_, thunkAPI) => {
    try {
      return await paymentsService.getPaymentHistory();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          (error.response.data.message || error.response.data.msg)) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get payment details
export const getPaymentDetails = createAsyncThunk(
  'payments/getDetails',
  async (id, thunkAPI) => {
    try {
      return await paymentsService.getPaymentDetails(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          (error.response.data.message || error.response.data.msg)) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearPaymentIntent: (state) => {
      state.paymentIntent = null;
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Payment Intent
      .addCase(createPaymentIntent.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.paymentIntent = action.payload;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Confirm Payment
      .addCase(confirmPayment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentPayment = action.payload;
        state.paymentIntent = null;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Refund Payment
      .addCase(refundPayment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(refundPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update the payment in the payments array
        state.payments = state.payments.map(payment => 
          payment._id === action.payload.paymentId 
            ? { ...payment, status: 'refunded' } 
            : payment
        );
        // Also update currentPayment if it's the same payment
        if (state.currentPayment && state.currentPayment._id === action.payload.paymentId) {
          state.currentPayment = { ...state.currentPayment, status: 'refunded' };
        }
      })
      .addCase(refundPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get Payment History
      .addCase(getPaymentHistory.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getPaymentHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.payments = action.payload;
      })
      .addCase(getPaymentHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get Payment Details
      .addCase(getPaymentDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getPaymentDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentPayment = action.payload;
      })
      .addCase(getPaymentDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset, clearPaymentIntent, clearCurrentPayment } = paymentsSlice.actions;
export default paymentsSlice.reducer;