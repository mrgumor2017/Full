import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'http://localhost:8000/api/';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.access;  // Використовуємо 'access'
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],  // Додаємо тег для інвалідування кешу
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (formData) => ({
        url: '/auth/register/',
        method: 'POST',
        body: formData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    fetchUser: builder.query({
      query: () => 'auth/user/',  // Твій маршрут для отримання поточного користувача
      providesTags: ['User'],  // Позначаємо, що цей запит дає тег 'User'
    }),
    updateUser: builder.mutation({
      query: (formData) => ({
        url: 'auth/user/',    // той самий маршрут, що і fetchUser
        method: 'PUT',        // або 'PATCH', залежно від бекенду
        body: formData,
      }),
      invalidatesTags: ['User'],  // Після оновлення користувача — інвалідовуємо кеш, щоб fetchUser оновився
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useFetchUserQuery,
  useUpdateUserMutation,  // експортуємо хук для оновлення користувача
} = authApi;
