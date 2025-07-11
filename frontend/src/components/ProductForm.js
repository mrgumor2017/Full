import React, { useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useGetCategoriesQuery } from '../api/categoryApi';

const { Option } = Select;

const ProductForm = ({ selectedProduct, clearSelection, createProduct, updateProduct, refetchProducts }) => {
  const [form] = Form.useForm();
  const { data: categories } = useGetCategoriesQuery();

  useEffect(() => {
    if (selectedProduct) {
      form.setFieldsValue({
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: selectedProduct.price,
        category: selectedProduct.category?.id,
      });
    } else {
      form.resetFields();
    }
  }, [selectedProduct, form]);

  const handleFinish = async (values) => {
    try {
      if (selectedProduct) {
        await updateProduct({ id: selectedProduct.id, ...values }).unwrap();
        message.success('Продукт оновлено');
      } else {
        await createProduct(values).unwrap();
        message.success('Продукт створено');
      }
      form.resetFields();
      clearSelection();
      refetchProducts();
    } catch {
      message.error('Сталася помилка при збереженні продукту');
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      layout="vertical"
      style={{ marginBottom: 20 }}
    >
      <Form.Item
        name="name"
        label="Назва продукту"
        rules={[{ required: true, message: 'Будь ласка, введіть назву продукту!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Опис продукту"
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="price"
        label="Ціна"
        rules={[
          { required: true, message: 'Будь ласка, введіть ціну продукту!' },
          { type: 'number', message: 'Ціна повинна бути числом!', transform: (value) => +value },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="category"
        label="Категорія"
        rules={[{ required: true, message: 'Будь ласка, оберіть категорію!' }]}
      >
        <Select placeholder="Оберіть категорію">
          {categories?.results.map((category) => (
            <Option key={category.id} value={category.id}>
              {category.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {selectedProduct ? 'Оновити продукт' : 'Створити продукт'}
        </Button>
        {selectedProduct && (
          <Button style={{ marginLeft: 10 }} onClick={clearSelection}>
            Скасувати
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default ProductForm;