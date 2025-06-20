import { Card, Row, Col } from 'antd';
import { useGetCategoriesQuery } from '../api/categoryApi';

const HomePage = () => {
  const { data} = useGetCategoriesQuery(1);
  const categories = data?.results || data || [];

  return (
    <Row gutter={[16, 16]} style={{ padding: 20 }}>
      {categories.map((category) => {
        const imageUrl =
          category.image?.startsWith('http')
            ? category.image
            : `http://localhost:8000${category.image?.startsWith('/media') ? category.image : `/media/${category.image}`}`;

        return (
          <Col xs={24} sm={12} md={8} lg={6} key={category.id}>
            <Card
              hoverable
              cover={
                category.image && (
                  <img
                    alt={category.name}
                    src={imageUrl}
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                )
              }
            >
              <Card.Meta title={category.name} description={category.description} />
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default HomePage;
