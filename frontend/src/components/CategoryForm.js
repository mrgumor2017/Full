import React, { useEffect } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const CategoryForm = ({
  selectedCategory,
  clearSelection,
  createCategory,
  updateCategory,
  refetchCategories,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedCategory) {
      form.setFieldsValue({
        name: selectedCategory.name,
        description: selectedCategory.description,
        image: [],
      });
    } else {
      form.resetFields();
    }
  }, [selectedCategory, form]);

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    if (values.image && values.image[0]) {
      formData.append('image', values.image[0].originFileObj);
    }

    try {
      if (selectedCategory) {
        await updateCategory({ id: selectedCategory.id, formData }).unwrap();
        message.success('Категорію оновлено');
      } else {
        await createCategory(formData).unwrap();
        message.success('Категорію створено');
      }
      form.resetFields();
      refetchCategories();
      clearSelection();
    } catch (error) {
      message.error('Помилка при збереженні категорії');
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
        rules={[{ required: true, message: 'Введіть назву категорії' }]}
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

      <Form.Item
        name="image"
        label="Зображення"
        valuePropName="fileList"
        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
      >
        <Upload beforeUpload={() => false} listType="picture">
          <Button icon={<UploadOutlined />}>Завантажити зображення</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {selectedCategory ? 'Оновити' : 'Додати'}
        </Button>
        {selectedCategory && (
          <Button onClick={clearSelection} style={{ marginLeft: 8 }}>
            Скасувати
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default CategoryForm;
