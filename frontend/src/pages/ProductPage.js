import React, { useState } from 'react';
import { Table, Button, message, Card, Space, Popconfirm } from 'antd';
import ProductForm from '../components/ProductForm';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../api/productApi';

const ProductPage = () => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data,
    isLoading,
    refetch,
  } = useGetProductsQuery(currentPage);

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id).unwrap();
      message.success('Продукт видалено');
    } catch {
      message.error('Помилка при видаленні');
    }
  };

  const columns = [
    { title: 'Назва', dataIndex: 'name', key: 'name' },
    { title: 'Опис', dataIndex: 'description', key: 'description' },
    { title: 'Ціна', dataIndex: 'price', key: 'price' },
    { title: 'Категорія', dataIndex: 'category', key: 'category', render: (category) => category?.name || 'Без категорії' },
    {
      title: 'Дії',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => setEditingProduct(record)}>Редагувати</Button>
          <Popconfirm
            title="Ви впевнені, що хочете видалити?"
            onConfirm={() => handleDelete(record.id)}
            okText="Так"
            cancelText="Ні"
          >
            <Button danger>Видалити</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Продукти" style={{ margin: 20 }}>
      <ProductForm
        selectedProduct={editingProduct}
        clearSelection={() => setEditingProduct(null)}
        createProduct={createProduct}
        updateProduct={updateProduct}
        refetchProducts={refetch}
      />
      <Table
        rowKey="id"
        dataSource={data?.results || []}
        columns={columns}
        loading={isLoading}
        pagination={{
          current: currentPage,
          pageSize: 10,
          total: data?.count || 0,
          onChange: (page) => setCurrentPage(page),
        }}
        style={{ marginTop: 20 }}
      />
    </Card>
  );
};

export default ProductPage;