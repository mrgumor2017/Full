import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner, Alert, Button, Form } from 'react-bootstrap';

export default function CategoryForm({ onSuccess, selectedCategory }) {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedCategory) {
      setFormData({
        name: selectedCategory.name,
        description: selectedCategory.description,
      });
    }
  }, [selectedCategory]);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (selectedCategory) {
        await axios.put(`http://localhost:8000/api/categories/${selectedCategory.id}/`, formData);
      } else {
        await axios.post('http://localhost:8000/api/categories/', formData);
      }
      onSuccess();
      setFormData({ name: '', description: '' });
    } catch (err) {
      setError('Помилка при збереженні. Перевірте дані.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Назва</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Опис</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </Form.Group>

      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? <Spinner size="sm" animation="border" /> : selectedCategory ? 'Оновити' : 'Додати'}
      </Button>
    </Form>
  );
}