import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Spinner, ProgressBar, Alert } from 'react-bootstrap';
import CategoryForm from './CategoryForm';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const fetchCategories = async (pageNum = 1) => {
  setLoading(true);
  try {
    const response = await axios.get(`http://localhost:8000/api/categories/?page=${page}`);
    setCategories(response.data.results);
    setCount(response.data.count);  // загальна кількість категорій
    setError('');
  } catch (err) {
    setError('Не вдалося отримати категорії.');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchCategories();
  }, [page]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`http://localhost:8000/api/categories/${id}/`);
      fetchCategories();
    } catch (err) {
      setError('Помилка при видаленні.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // прокрутка до форми
  };

  const handleSuccess = () => {
    fetchCategories();
    setSelectedCategory(null);
  };
  const totalPages = Math.ceil(count / 10);
  return (
    <div className="container mt-4">
      <h2>Категорії</h2>

      {loading && <ProgressBar animated now={100} className="mb-3" />}

      {error && <Alert variant="danger">{error}</Alert>}

      <CategoryForm
        onSuccess={handleSuccess}
        selectedCategory={selectedCategory}
      />

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Назва</th>
            <th>Опис</th>
            <th>Створено</th>
            <th>Оновлено</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, index) => (
            <tr key={cat.id}>
              <td>{(page - 1) * 10 + index + 1}</td>
              <td>{cat.name}</td>
              <td>{cat.description}</td>
              <td>{new Date(cat.created_at).toLocaleString()}</td>
              <td>{new Date(cat.updated_at).toLocaleString()}</td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => handleEdit(cat)}
                >
                  Редагувати
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(cat.id)}
                  disabled={deletingId === cat.id}
                >
                  {deletingId === cat.id ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    'Видалити'
                  )}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="d-flex justify-content-between align-items-center">
        <Button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Попередня
        </Button>

        <span>Сторінка {page} з {totalPages}</span>

        <Button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Наступна
        </Button>
      </div>
    </div>
  );
}
