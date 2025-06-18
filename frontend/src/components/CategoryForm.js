import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';

const CategoryForm = ({
  selectedCategory,
  clearSelection,
  onCreate,
  onUpdate,
  fetchCategories,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedCategory) {
      form.setFieldsValue(selectedCategory);
    } else {
      form.resetFields();
    }
  }, [selectedCategory, form]);

  const onFinish = async (values) => {
    try {
      if (selectedCategory) {
        await onUpdate(selectedCategory.id, values);
        message.success('Категорію оновлено');
      } else {
        await onCreate(values);
        message.success('Категорію створено');
      }
      form.resetFields();
      clearSelection();
      fetchCategories();
    } catch (error) {
      message.error('Помилка при збереженні');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 500, margin: '20px auto' }}
    >
      <Form.Item
        name="name"
        label="Назва"
        rules={[{ required: true, message: 'Введіть назву' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Опис"
        rules={[{ required: true, message: 'Введіть опис' }]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {selectedCategory ? 'Оновити' : 'Додати'}
        </Button>
        {selectedCategory && (
          <Button
            style={{ marginLeft: 10 }}
            onClick={() => {
              form.resetFields();
              clearSelection();
            }}
          >
            Скасувати
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default CategoryForm;
