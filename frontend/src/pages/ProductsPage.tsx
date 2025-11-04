import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../api/productService';
import { categoryService } from '../api/categoryService';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [searchParams]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params: any = {};
      
      if (searchParams.get('category')) params.category = searchParams.get('category');
      if (searchParams.get('search')) params.search = searchParams.get('search');
      if (minPrice) params.minPrice = parseFloat(minPrice);
      if (maxPrice) params.maxPrice = parseFloat(maxPrice);
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;

      const response = await productService.getProducts(params);
      setProducts(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải sản phẩm');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    const params: any = {};
    if (selectedCategory) params.category = selectedCategory;
    if (searchQuery) params.search = searchQuery;
    
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('name');
    setSortOrder('asc');
    setSearchParams({});
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4 gradient-text fade-in">🛍️ Khám phá sản phẩm</h1>

      <Row>
        {/* Sidebar Filters */}
        <Col md={3} className="mb-4 slide-in-left">
          <div className="p-3 border rounded bg-light shadow-sm">
            <h5 className="mb-3 fw-bold">🔍 Lọc sản phẩm</h5>

            {/* Category Filter */}
            <Form.Group className="mb-3">
              <Form.Label>Danh mục</Form.Label>
              <Form.Select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Lọc theo danh mục"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Search */}
            <Form.Group className="mb-3">
              <Form.Label>Tìm kiếm</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form.Group>

            {/* Price Range */}
            <Form.Group className="mb-3">
              <Form.Label>Khoảng giá</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Từ"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Đến"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </Col>
              </Row>
            </Form.Group>

            {/* Sort By */}
            <Form.Group className="mb-3">
              <Form.Label>Sắp xếp theo</Form.Label>
              <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sắp xếp sản phẩm theo">
                <option value="name">Tên</option>
                <option value="price">Giá</option>
                <option value="rating">Đánh giá</option>
                <option value="sold">Bán chạy</option>
              </Form.Select>
            </Form.Group>

            {/* Sort Order */}
            <Form.Group className="mb-3">
              <Form.Label>Thứ tự</Form.Label>
              <Form.Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} aria-label="Thứ tự sắp xếp">
                <option value="asc">Tăng dần</option>
                <option value="desc">Giảm dần</option>
              </Form.Select>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="success" onClick={handleFilterChange}>
                Áp dụng
              </Button>
              <Button variant="outline-secondary" onClick={handleResetFilters}>
                Đặt lại
              </Button>
            </div>
          </div>
        </Col>

        {/* Products Grid */}
        <Col md={9}>
          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
              <p className="mt-2">Đang tải sản phẩm...</p>
            </div>
          )}

          {error && (
            <Alert variant="danger">
              ❌ {error}
              <div className="mt-2">
                <Button variant="outline-danger" onClick={loadProducts}>Thử lại</Button>
              </div>
            </Alert>
          )}

          {!loading && !error && products.length === 0 && (
            <Alert variant="info">
              ℹ️ Không tìm thấy sản phẩm nào
            </Alert>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <div className="mb-3 fade-in">
                <p className="text-muted fw-bold">✨ Tìm thấy {products.length} sản phẩm</p>
              </div>
              <Row xs={1} md={2} lg={3} className="g-4">
                {products.map((product, index) => (
                  <Col key={product.id} style={{ animationDelay: `${index * 0.05}s` }} className="scale-in">
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductsPage;

