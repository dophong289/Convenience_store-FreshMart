import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link to={`/products?category=${category.slug}`} className="text-decoration-none">
      <Card className="h-100 shadow-sm text-center category-card" style={{ cursor: 'pointer' }}>
        <Card.Body>
          <div style={{ fontSize: '3rem' }} className="mb-2">
            {category.icon}
          </div>
          <Card.Title className="h6 fw-bold">{category.name}</Card.Title>
          <Card.Text className="text-muted small">
            {category.productCount} sản phẩm
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default CategoryCard;

