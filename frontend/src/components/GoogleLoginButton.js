import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/authSlice';

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const decoded = jwtDecode(credential);

      console.log("Google JWT payload:", decoded);

      // Надіслати токен на бекенд
      const response = await axios.post('http://localhost:8000/api/auth/google/', {
        id_token: credential,
      });

      dispatch(setCredentials({
        access: response.data.access,
        refresh: response.data.refresh,
        user: response.data.user, // якщо бекенд повертає user
      }));

      message.success('Вхід через Google успішний');
      navigate('/');
    } catch (err) {
      console.error(err);
      message.error('Помилка Google-входу');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 20 }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          message.error('Не вдалося увійти через Google');
        }}
      />
    </div>
  );
};

export default GoogleLoginButton;
