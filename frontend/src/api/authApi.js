import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'http://localhost:8000/api/';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.access;  // Використовуємо 'access' замість 'token'
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (user) => ({
        url: 'auth/register/',
        method: 'POST',
        body: user,
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
      query: () => 'auth/user/',  // Перевірте цей маршрут
    }),
  }),
});


export const {
  useRegisterMutation,
  useLoginMutation,
  useFetchUserQuery,
} = authApi;
