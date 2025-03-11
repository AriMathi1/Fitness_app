import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import trainersService from '../../api/trainersServices';

const initialState = {
  trainers: [],
  currentTrainer: null,
  reviews: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

export const getTrainers = createAsyncThunk(
  'trainers/getTrainers',
  async (filters, thunkAPI) => {
    try {
      return await trainersService.getTrainers(filters);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTrainer = createAsyncThunk(
  'trainers/getTrainer',
  async (id, thunkAPI) => {
    try {
      return await trainersService.getTrainer(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTrainerReviews = createAsyncThunk(
  'trainers/getTrainerReviews',
  async (trainerId, thunkAPI) => {
    try {
      return await trainersService.getTrainerReviews(trainerId);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addTrainerReview = createAsyncThunk(
  'trainers/addTrainerReview',
  async ({ trainerId, reviewData }, thunkAPI) => {
    try {
      return await trainersService.addTrainerReview(trainerId, reviewData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const respondToReview = createAsyncThunk(
  'trainers/respondToReview',
  async ({ reviewId, response }, thunkAPI) => {
    try {
      return await trainersService.respondToReview(reviewId, response);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const trainersSlice = createSlice({
  name: 'trainers',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentTrainer: (state) => {
      state.currentTrainer = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTrainers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTrainers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.trainers = action.payload;
      })
      .addCase(getTrainers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      .addCase(getTrainer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTrainer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentTrainer = action.payload;
      })
      .addCase(getTrainer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      .addCase(getTrainerReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTrainerReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reviews = action.payload;
      })
      .addCase(getTrainerReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      .addCase(addTrainerReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addTrainerReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reviews.push(action.payload);
      })
      .addCase(addTrainerReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      .addCase(respondToReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(respondToReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reviews = state.reviews.map(review => 
          review._id === action.payload._id ? action.payload : review
        );
      })
      .addCase(respondToReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset, clearCurrentTrainer } = trainersSlice.actions;
export default trainersSlice.reducer;