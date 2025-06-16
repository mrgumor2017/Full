import React from "react";
import CategoryList from "./components/CategoryList";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Категорії</h1>
      <CategoryList />
    </div>
  );
}

export default App;
