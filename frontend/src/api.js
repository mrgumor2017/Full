import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/categories/';

export const fetchCategories = () => axios.get(BASE_URL);

export const createCategory = (data) => axios.post(BASE_URL, data);

export const updateCategory = (id, data) => axios.put(`${BASE_URL}${id}/`, data);

export const deleteCategory = (id) => axios.delete(`${BASE_URL}${id}/`);
