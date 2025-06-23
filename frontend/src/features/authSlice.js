import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';  // Правильний імпорт

// Initial state
const initialState = {
  user: null,
  access: null,
  refresh: null,
  loading: false,
  error: null,
};

// Асинхронний thunk для отримання даних користувача
export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.access; // Отримуємо токен з глобального стану
    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const response = await fetch("http://localhost:8000/api/auth/user/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,  // передача токену
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      return data;  // Повертаємо отримані дані користувача
    } catch (error) {
      return rejectWithValue(error.message);  // Повертаємо помилку
    }
  }
);

// Слайс аутентифікації
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { access, refresh, user } = action.payload;
      state.access = access;
      state.refresh = refresh;
      state.user = user; // Зберігаємо дані користувача
      console.log("Updated state:", state); // Перевірка збереження користувача
    },
    logout: (state) => {
      state.user = null;
      state.access = null;
      state.refresh = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };  // Зберігаємо отриману інформацію про користувача
        state.loading = false;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user data";
      });
  },
});



export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
