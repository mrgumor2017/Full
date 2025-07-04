import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { Layout, Menu, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchUserQuery } from './api/authApi';
import { logout, setCredentials } from './features/authSlice';
import { GoogleOAuthProvider } from '@react-oauth/google';

import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

const { Header, Content, Footer } = Layout;

// Компонент для захисту приватних маршрутів
const PrivateRoute = ({ element }) => {
  const token = useSelector((state) => state.auth.access); // Використовуємо 'access' для отримання токену
  return token ? element : <Navigate to="/login" />; // Якщо немає токену, редірект на login
};

function AppLayout() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.access); // Використовуємо 'access' для токену
  const user = useSelector((state) => state.auth.user); // Отримуємо користувача з Redux
  const { data: userData, isSuccess } = useFetchUserQuery(undefined, { skip: !token });
  const navigate = useNavigate();

  console.log("Current user from Redux:", user);
  useEffect(() => {
    if (isSuccess && userData) {
      dispatch(setCredentials({ access: token, user: userData })); // Зберігаємо користувача та токен
      console.log("User data stored in Redux:", userData);
    }
  }, [userData, isSuccess, dispatch, token]);

  const handleLogout = () => {
    dispatch(logout());
    message.success('Ви вийшли з системи');
    navigate('/login');
  };

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          selectable={false}
          items={[
            {
              key: 'home',
              label: <Link to="/">Головна</Link>,
            },
            {
              key: 'categories',
              label: <Link to="/categories">Категорії</Link>,
            },
            ...(user ? [
              {
                key: 'user',
                label: (
                  <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                    <img
                      src={user.photo}
                      alt="avatar"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid white',
                        flexShrink: 0,
                      }}
                    />
                    <span>{user.username || user.email}</span>
                  </Link>
                ),
              },
              {
                key: 'profile',
                label: <Link to="/profile">Профіль</Link>,
              },
              {
                key: 'logout',
                label: (
                  <Button type="link" onClick={handleLogout} style={{ color: 'white' }}>
                    Вийти
                  </Button>
                ),
              },
            ] : [
              {
                key: 'login',
                label: <Link to="/login">Увійти</Link>,
              },
              {
                key: 'register',
                label: <Link to="/register">Реєстрація</Link>,
              },
            ])
          ]}
        />

      </Header>

      <Content style={{ padding: '24px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<PrivateRoute element={<CategoryPage />} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
      </Content>

      <Footer style={{ textAlign: 'center' }}>React + Django API © 2025</Footer>
    </Layout>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId="735629438683-hu9s33dcfkokmutc8e9fnjvubl9rtkf6.apps.googleusercontent.com">
      <Router>
        <AppLayout />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
