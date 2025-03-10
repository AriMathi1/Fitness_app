import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import profileService from '../../api/profileService';

const initialState = {
  profile: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  isUpdating: false,
  updateSuccess: false
};

// Get user profile
export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (_, thunkAPI) => {
    try {
      return await profileService.getProfile();
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

// Update user profile
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, thunkAPI) => {
    try {
      return await profileService.updateProfile(profileData);
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

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.isUpdating = false;
      state.updateSuccess = false;
    },
    resetUpdateStatus: (state) => {
      state.isUpdating = false;
      state.updateSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.profile = null;
      })
      
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isUpdating = true;
        state.updateSuccess = false;
        state.isError = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updateSuccess = true;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset, resetUpdateStatus } = profileSlice.actions;
export default profileSlice.reducer;