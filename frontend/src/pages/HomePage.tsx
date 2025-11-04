import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Carousel, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { productService } from '../api/productService';
import { categoryService } from '../api/categoryService';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';

const HomePage: React.FC = () => {
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [flashSaleRes, bestSellingRes, categoriesRes] = await Promise.all([
        productService.getFlashSaleProducts(),
        productService.getBestSellingProducts(),
        categoryService.getAllCategories(),
      ]);

      setFlashSaleProducts(flashSaleRes.data || []);
      setBestSellingProducts(bestSellingRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          ❌ {error}
          <div className="mt-2">
            <Button variant="outline-danger" onClick={loadData}>Thử lại</Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <>
      {/* Hero Carousel */}
      <Carousel className="mb-4">
        <Carousel.Item>
          <div 
            className="d-flex align-items-center justify-content-center"
            style={{ 
              height: '400px', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
            }}
          >
            <div className="text-center text-white">
              <h1 className="display-4 fw-bold">Chào mừng đến FreshMart</h1>
              <p className="lead">Thực phẩm tươi ngon mỗi ngày</p>
              <Link to="/products">
                <Button variant="light" size="lg">Mua sắm ngay</Button>
              </Link>
            </div>
          </div>
        </Carousel.Item>
        
        <Carousel.Item>
          <div 
            className="d-flex align-items-center justify-content-center"
            style={{ 
              height: '400px', 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' 
            }}
          >
            <div className="text-center text-white">
              <h1 className="display-4 fw-bold">🔥 Flash Sale Hôm Nay</h1>
              <p className="lead">Giảm giá đến 50% cho sản phẩm chọn lọc</p>
              <Link to="/products">
                <Button variant="light" size="lg">Xem ngay</Button>
              </Link>
            </div>
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div 
            className="d-flex align-items-center justify-content-center"
            style={{ 
              height: '400px', 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' 
            }}
          >
            <div className="text-center text-white">
              <h1 className="display-4 fw-bold">🚚 Miễn phí vận chuyển</h1>
              <p className="lead">Cho đơn hàng từ 200.000đ</p>
              <Link to="/products">
                <Button variant="light" size="lg">Mua ngay</Button>
              </Link>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>

      <Container className="py-4">
        {/* Categories Section */}
        <section className="mb-5 fade-in">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold gradient-text">📂 Danh mục sản phẩm</h2>
            <Link to="/products" className="text-decoration-none text-primary fw-bold">
              Xem tất cả →
            </Link>
          </div>
          <Row xs={2} md={4} lg={6} className="g-3">
            {categories.map((category, index) => (
              <Col key={category.id} style={{ animationDelay: `${index * 0.1}s` }} className="fade-in">
                <CategoryCard category={category} />
              </Col>
            ))}
          </Row>
        </section>

        {/* Flash Sale Section */}
        {flashSaleProducts.length > 0 && (
          <section className="mb-5 slide-in-left">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold text-danger">🔥 Flash Sale Hôm Nay</h2>
              <Link to="/products?flashsale=true" className="text-decoration-none text-danger fw-bold">
                Xem tất cả →
              </Link>
            </div>
            <Row xs={1} md={2} lg={4} className="g-4">
              {flashSaleProducts.slice(0, 8).map((product, index) => (
                <Col key={product.id} style={{ animationDelay: `${index * 0.1}s` }} className="scale-in">
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          </section>
        )}

        {/* Best Selling Section */}
        {bestSellingProducts.length > 0 && (
          <section className="mb-5 slide-in-right">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold gradient-text">🌟 Sản phẩm bán chạy</h2>
              <Link to="/products?bestselling=true" className="text-decoration-none text-primary fw-bold">
                Xem tất cả →
              </Link>
            </div>
            <Row xs={1} md={2} lg={4} className="g-4">
              {bestSellingProducts.slice(0, 8).map((product, index) => (
                <Col key={product.id} style={{ animationDelay: `${index * 0.1}s` }} className="scale-in">
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          </section>
        )}
      </Container>
    </>
  );
};

export default HomePage;

