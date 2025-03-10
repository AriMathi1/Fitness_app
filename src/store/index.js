import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import profileReducer from '../features/profile/profileSlice';
import classesReducer from '../features/classes/classesSlice';
import trainersReducer from '../features/trainers/trainersSlice';
import bookingsReducer from '../features/bookings/bookingsSlice';
import paymentsReducer from '../features/payments/paymentsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    classes: classesReducer,
    trainers: trainersReducer,
    bookings: bookingsReducer,
    payments: paymentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;