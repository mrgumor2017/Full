import { configureStore } from '@reduxjs/toolkit';
import { categoryApi } from '../api/categoryApi';
import { authApi } from '../api/authApi';
import authReducer from '../features/authSlice';
import { productApi } from '../api/productApi'; // Імпортуємо продукт API


export const store = configureStore({
  reducer: {
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      categoryApi.middleware,
      productApi.middleware,
      authApi.middleware
    ),
});
export default store;