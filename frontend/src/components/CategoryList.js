import React from 'react';
import { Table, Button, Popconfirm, Space } from 'antd';

const CategoryList = ({ data, onEdit, onDelete, loading }) => {
  const columns = [
    {
      title: '#',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Назва',
      dataIndex: 'name',
    },
    {
      title: 'Опис',
      dataIndex: 'description',
    },
    {
      title: 'Дії',
      render: (_, record) => (
        <Space>
          <Button onClick={() => onEdit(record)}>Редагувати</Button>
          <Popconfirm
            title="Видалити категорію?"
            onConfirm={() => onDelete(record.id)}
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
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={false}
    />
  );
};

export default CategoryList;
