import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import classesService from '../../api/classesService';

// Initial state of the slice
const initialState = {
  classes: [],
  currentClass: null,
  classTypes: [],
  recommendedClasses: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

// Get all classes with filtering
export const getClasses = createAsyncThunk(
  'classes/getAll',
  async (filters, thunkAPI) => {
    try {
      return await classesService.getClasses(filters);
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

// Get class by ID
export const getClass = createAsyncThunk(
  'classes/getOne',
  async (classId, thunkAPI) => {
    try {
      return await classesService.getClass(classId);
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

// Create a new class (trainers only)
export const createClass = createAsyncThunk(
  'classes/create',
  async (classData, thunkAPI) => {
    try {
      return await classesService.createClass(classData);
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

// Update a class (trainers only)
export const updateClass = createAsyncThunk(
  'classes/update',
  async ({ classId, classData }, thunkAPI) => {
    try {
      return await classesService.updateClass(classId, classData);
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

// Delete a class (trainers only)
export const deleteClass = createAsyncThunk(
  'classes/delete',
  async (classId, thunkAPI) => {
    try {
      await classesService.deleteClass(classId);
      return classId; // Return the ID for filtering in the reducer
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

// Get class types for filtering
export const getClassTypes = createAsyncThunk(
  'classes/getTypes',
  async (_, thunkAPI) => {
    try {
      return await classesService.getClassTypes();
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

// Get classes by trainer
export const getTrainerClasses = createAsyncThunk(
  'classes/getByTrainer',
  async (trainerId, thunkAPI) => {
    try {
      return await classesService.getTrainerClasses(trainerId);
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

// Get personalized class recommendations
export const getRecommendations = createAsyncThunk(
  'classes/getRecommendations',
  async (limit = 5, thunkAPI) => {
    try {
      return await classesService.getRecommendations(limit);
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

export const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCurrentClass: (state) => {
      state.currentClass = null;
    },
    clearClasses: (state) => {
      state.classes = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Classes
      .addCase(getClasses.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getClasses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classes = action.payload;
      })
      .addCase(getClasses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get Class by ID
      .addCase(getClass.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentClass = action.payload;
      })
      .addCase(getClass.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Create Class
      .addCase(createClass.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classes.unshift(action.payload); // Add to the beginning of the array
      })
      .addCase(createClass.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update Class
      .addCase(updateClass.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update the class in the classes array
        state.classes = state.classes.map(classItem => 
          classItem._id === action.payload._id ? action.payload : classItem
        );
        // Also update currentClass if it's the same class
        if (state.currentClass && state.currentClass._id === action.payload._id) {
          state.currentClass = action.payload;
        }
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Delete Class
      .addCase(deleteClass.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Remove the class from the classes array
        state.classes = state.classes.filter(classItem => classItem._id !== action.payload);
        // Also clear currentClass if it's the same class
        if (state.currentClass && state.currentClass._id === action.payload) {
          state.currentClass = null;
        }
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get Class Types
      .addCase(getClassTypes.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getClassTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classTypes = action.payload;
      })
      .addCase(getClassTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get Trainer Classes
      .addCase(getTrainerClasses.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getTrainerClasses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classes = action.payload;
      })
      .addCase(getTrainerClasses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Get Recommendations
      .addCase(getRecommendations.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getRecommendations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recommendedClasses = action.payload;
      })
      .addCase(getRecommendations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset, clearCurrentClass, clearClasses } = classesSlice.actions;
export default classesSlice.reducer;