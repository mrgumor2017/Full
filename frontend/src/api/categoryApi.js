const BASE_URL = "http://127.0.0.1:8000/api/categories/";

export const fetchCategories = (page = 1) =>
  fetch(`${BASE_URL}?page=${page}`).then((res) => res.json());

export const createCategory = (data) =>
  fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const updateCategory = (id, data) =>
  fetch(`${BASE_URL}${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deleteCategory = (id) =>
  fetch(`${BASE_URL}${id}/`, { method: "DELETE" });
