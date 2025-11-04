import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <Card className="h-100 shadow-sm product-card">
      <Link to={`/product/${product.slug}`} className="text-decoration-none img-zoom">
        <Card.Img 
          variant="top" 
          src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
          alt={product.name}
          style={{ height: '200px', objectFit: 'cover' }}
        />
      </Link>
      
      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          {product.isFlashSale && (
            <Badge bg="danger" className="me-2">
              🔥 Flash Sale
            </Badge>
          )}
          {product.stock <= 0 && (
            <Badge bg="secondary">Hết hàng</Badge>
          )}
        </div>

        <Link to={`/product/${product.slug}`} className="text-decoration-none text-dark">
          <Card.Title className="h6" style={{ minHeight: '48px' }}>
            {product.name}
          </Card.Title>
        </Link>

        <div className="mb-2">
          <span className="text-warning me-1">⭐</span>
          <span>{product.rating.toFixed(1)}</span>
          <span className="text-muted small ms-2">({product.reviewCount})</span>
        </div>

        <div className="mb-2">
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="text-muted text-decoration-line-through small">
              {formatPrice(product.originalPrice)}
            </div>
          )}
          <div className="fw-bold text-success fs-5">
            {formatPrice(product.price)}
          </div>
        </div>

        {product.brand && (
          <div className="text-muted small mb-2">
            Thương hiệu: {product.brand}
          </div>
        )}

        {product.origin && (
          <div className="text-muted small mb-2">
            Xuất xứ: {product.origin}
          </div>
        )}

        <div className="mt-auto">
          <Button 
            variant="success" 
            className="w-100"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? '🛒 Thêm vào giỏ' : 'Hết hàng'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;

