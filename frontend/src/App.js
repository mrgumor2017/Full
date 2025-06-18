import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Router>
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']}>
            <Menu.Item key="home">
              <Link to="/">Головна</Link>
            </Menu.Item>
            <Menu.Item key="categories">
              <Link to="/categories">Категорії</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '24px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<CategoryPage />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>React + Django API © 2025</Footer>
      </Layout>
    </Router>
  );
}

export default App;
