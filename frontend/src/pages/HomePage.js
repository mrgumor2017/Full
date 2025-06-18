import React from 'react';
import { Typography, Card } from 'antd';

const HomePage = () => (
  <Card style={{ maxWidth: 600, margin: 'auto', marginTop: 50 }}>
    <Typography.Title level={2}>Ласкаво просимо!</Typography.Title>
    <Typography.Paragraph>
      Це головна сторінка. Перейдіть до категорій, щоб додати або керувати ними.
    </Typography.Paragraph>
  </Card>
);

export default HomePage;
