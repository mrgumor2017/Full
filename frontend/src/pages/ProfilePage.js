import React, { useEffect } from 'react';
import { Form, Input, Button, Upload, message, Card, Avatar } from 'antd';
import { useSelector } from 'react-redux';
import { useUpdateUserMutation, useFetchUserQuery } from '../api/authApi';

const ProfilePage = () => {
  const token = useSelector(state => state.auth.access);
  const { data: user, isLoading, refetch } = useFetchUserQuery(undefined, { skip: !token });
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        phone: user.phone || '',
        photo: null,
      });
    }
  }, [user, form]);

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append('username', values.username);
      formData.append('email', values.email);
      formData.append('phone', values.phone || '');
      if (values.photo && values.photo.file) {
        formData.append('photo', values.photo.file);
      }

      await updateUser(formData).unwrap();
      message.success('Профіль оновлено');
      refetch();
    } catch (error) {
      message.error('Помилка оновлення профілю');
    }
  };

  if (isLoading) {
    return <div>Завантаження профілю...</div>;
  }

  return (
    <Card title="Профіль користувача" style={{ maxWidth: 600, margin: '20px auto' }}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item label="Фото">
          <Avatar
            size={100}
            src={user?.photo ? `${user.photo}` : null}
            alt="User photo"
            style={{ marginBottom: 10 }}
          />
          <Form.Item
            name="photo"
            valuePropName="file"
            getValueFromEvent={e => e && e.fileList && e.fileList[0]}
            noStyle
          >
            <Upload
              maxCount={1}
              beforeUpload={() => false} // щоб не завантажувати автоматично
              accept="image/*"
              showUploadList={{ showRemoveIcon: true }}
              listType="picture"
            >
              <Button>Завантажити нове фото</Button>
            </Upload>
          </Form.Item>
        </Form.Item>

        <Form.Item
          name="username"
          label="Ім'я користувача"
          rules={[{ required: true, message: 'Введіть ім’я користувача' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Введіть email' },
            { type: 'email', message: 'Некоректний email' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="phone" label="Телефон">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isUpdating} block>
            Зберегти
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProfilePage;
