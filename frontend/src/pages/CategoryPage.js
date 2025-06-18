import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, message, Card, Space, Popconfirm } from 'antd';
import CategoryForm from '../components/CategoryForm';
import axios from 'axios';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/categories/?page=${pagination.current}`);
      setCategories(res.data.results);
      setPagination(prev => ({
        ...prev,
        total: res.data.count,
      }));
    } catch {
      message.error('Помилка при завантаженні категорій');
    } finally {
      setLoading(false);
    }
  }, [pagination]);


  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleTableChange = (newPagination) => {
    setPagination(newPagination); // Оновлюємо пагінацію
    fetchCategories();             // Викликаємо завантаження категорій
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/categories/${id}/`);
      message.success('Категорію видалено');
      fetchCategories();
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
        fetchCategories={fetchCategories}  // Просто передаємо функцію
        onCreate={async (values) => {
          await axios.post('http://localhost:8000/api/categories/', values);
        }}
        onUpdate={async (id, values) => {
          await axios.put(`http://localhost:8000/api/categories/${id}/`, values);
        }}
      />
      <Table
        rowKey="id"
        dataSource={categories}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        style={{ marginTop: 20 }}
      />
    </Card>
  );
};

export default CategoryPage;
