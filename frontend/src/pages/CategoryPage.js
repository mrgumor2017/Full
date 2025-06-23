import React, { useState } from 'react';
import { Table, Button, message, Card, Space, Popconfirm } from 'antd';
import CategoryForm from '../components/CategoryForm';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '../api/categoryApi';
import { useSelector } from 'react-redux';

const CategoryPage = () => {
  const token = useSelector((state) => state.auth.token);
  if (!token) {
    return <Navigate to="/login" />;
  }
  const [editingCategory, setEditingCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data,
    isLoading,
    refetch,
  } = useGetCategoriesQuery(currentPage);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id).unwrap();
      message.success('Категорію видалено');
    } catch {
      message.error('Помилка при видаленні');
    }
  };

  const columns = [
    { title: 'Назва', dataIndex: 'name', key: 'name' },
    { title: 'Опис', dataIndex: 'description', key: 'description' },
    {
      title: 'Дії',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => setEditingCategory(record)}>Редагувати</Button>
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
    <Card title="Категорії" style={{ margin: 20 }}>
      <CategoryForm
        selectedCategory={editingCategory}
        clearSelection={() => setEditingCategory(null)}
        createCategory={createCategory}
        updateCategory={updateCategory}
        refetchCategories={refetch}
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

export default CategoryPage;
