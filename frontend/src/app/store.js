import { configureStore } from '@reduxjs/toolkit';
import { categoryApi } from '../api/categoryApi';
import { authApi } from '../api/authApi';
import authReducer from '../features/authSlice';

export const store = configureStore({
  reducer: {
    [categoryApi.reducerPath]: categoryApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      categoryApi.middleware,
      authApi.middleware
    ),
});
