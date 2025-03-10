import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookingsService from '../../api/bookingsService';

const initialState = {
  bookings: [],
  trainerBookings: [],
  currentBooking: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

// Get user bookings
export const getBookings = createAsyncThunk(
  'bookings/getAll',
  async (params, thunkAPI) => {
    try {
      return await bookingsService.getBookings(params);
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

// Get single booking
export const getBooking = createAsyncThunk(
  'bookings/getOne',
  async (id, thunkAPI) => {
    try {
      return await bookingsService.getBooking(id);
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

// Create booking
export const createBooking = createAsyncThunk(
  'bookings/create',
  async (bookingData, thunkAPI) => {
    try {
      return await bookingsService.createBooking(bookingData);
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

// Cancel booking
export const cancelBooking = createAsyncThunk(
  'bookings/cancel',
  async (id, thunkAPI) => {
    try {
      return await bookingsService.cancelBooking(id);
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

// Get trainer bookings
export const getTrainerBookings = createAsyncThunk(
  'bookings/getTrainerBookings',
  async (params, thunkAPI) => {
    try {
      return await bookingsService.getTrainerBookings(params);
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

// Update booking status (trainer)
export const updateBookingStatus = createAsyncThunk(
  'bookings/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      return await bookingsService.updateBookingStatus(id, status);
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

export const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Bookings
      .addCase(getBookings.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = action.payload;
      })
      .addCase(getBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get Single Booking
      .addCase(getBooking.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentBooking = action.payload;
      })
      .addCase(getBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Cancel Booking
      .addCase(cancelBooking.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update the booking in the bookings array
        state.bookings = state.bookings.map(booking => 
          booking._id === action.payload._id ? action.payload : booking
        );
        // Also update currentBooking if it's the same booking
        if (state.currentBooking && state.currentBooking._id === action.payload._id) {
          state.currentBooking = action.payload;
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get Trainer Bookings
      .addCase(getTrainerBookings.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getTrainerBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.trainerBookings = action.payload;
      })
      .addCase(getTrainerBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update Booking Status
      .addCase(updateBookingStatus.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update the booking in the trainerBookings array
        state.trainerBookings = state.trainerBookings.map(booking => 
          booking._id === action.payload._id ? action.payload : booking
        );
        // Also update currentBooking if it's the same booking
        if (state.currentBooking && state.currentBooking._id === action.payload._id) {
          state.currentBooking = action.payload;
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset, clearCurrentBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;