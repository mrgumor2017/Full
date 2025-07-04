import React, { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/auth/password-reset/', { email });
      message.success('Посилання для скидання паролю надіслано на пошту.');
    } catch (error) {
      message.error('Помилка. Спробуйте ще раз.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Відновлення паролю</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Введіть email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <button type="submit">Відновити</button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
