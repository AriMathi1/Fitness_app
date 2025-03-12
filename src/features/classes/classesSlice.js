import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import classesService from '../../api/classesService';

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

export const createClass = createAsyncThunk(
  'classes/create',
  async (classData, thunkAPI) => {
    try {
      console.log('Creating class with data:', classData);
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

export const deleteClass = createAsyncThunk(
  'classes/delete',
  async (classId, thunkAPI) => {
    try {
      await classesService.deleteClass(classId);
      return classId;
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
      
      .addCase(createClass.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classes.unshift(action.payload);
      })
      .addCase(createClass.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      .addCase(updateClass.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classes = state.classes.map(classItem => 
          classItem._id === action.payload._id ? action.payload : classItem
        );
        if (state.currentClass && state.currentClass._id === action.payload._id) {
          state.currentClass = action.payload;
        }
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      .addCase(deleteClass.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.classes = state.classes.filter(classItem => classItem._id !== action.payload);
        if (state.currentClass && state.currentClass._id === action.payload) {
          state.currentClass = null;
        }
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
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