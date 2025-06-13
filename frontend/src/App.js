import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
  axios.get('http://localhost:8000/api/categories/')
    .then(res => {
      console.log('API response:', res.data);
      setCategories(res.data.results);
    })
    .catch(err => {
      console.error('Error fetching categories:', err);
    });
  }, []);


  return (
    <div className="App">
      <h1>Категорії</h1>
        <ul>
          {Array.isArray(categories) ? (
            categories.map(category => (
              <li key={category.id}>
                <strong>{category.name}</strong><br />
                <em>Slug:</em> {category.slug}<br />
                <em>Description:</em> {category.description}<br />
                <em>Created at:</em> {new Date(category.created_at).toLocaleString()}<br />
                <hr />
              </li>
            ))
          ) : (
            <li>Немає даних</li>
          )}
        </ul>

    </div>
  );
}

export default App;
