import React from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { useLoginMutation } from '../api/authApi';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../features/authSlice';
import GoogleLoginButton from '../components/GoogleLoginButton';

const LoginPage = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const result = await login(values);

    if (result.data) {
      dispatch(setCredentials(result.data));
      message.success('Вхід успішний');
      navigate('/');
    } else {
      message.error('Невдалий вхід');
    }
  };

  return (
    <Card title="Вхід" style={{ maxWidth: 400, margin: '50px auto' }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="username" label="Email або логін" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Пароль"
          rules={[
            { required: true, message: 'Пароль є обов\'язковим!' },
            { min: 6, message: 'Пароль має містити мінімум 6 символів' },
            { pattern: /[A-Z]/, message: 'Пароль повинен містити хоча б одну велику літеру' },
            { pattern: /\d/, message: 'Пароль повинен містити хоча б одну цифру' },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            Увійти
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center', marginTop: 20 }}>
      <p>або</p>
      <GoogleLoginButton />
    </div>
    </Card>
  );
};

export default LoginPage;
