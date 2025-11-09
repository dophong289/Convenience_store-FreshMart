import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { productService } from '../api/productService';
import { categoryService } from '../api/categoryService';
import { Product, Category } from '../types';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    categoryId: '',
    categorySlug: '',
    brand: '',
    origin: '',
    stock: '',
    rating: '5.0',
    reviewCount: '0',
    isFlashSale: false,
    flashSaleDiscount: '',
    ingredients: '',
    expiry: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        categoryService.getAllCategories(),
        productService.getProducts(),
      ]);
      setCategories(categoriesRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Auto generate slug from name
      if (name === 'name') {
        const slug = value
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        setFormData(prev => ({ ...prev, slug }));
      }
      
      // Auto set categorySlug when category selected
      if (name === 'categoryId') {
        const category = categories.find(c => c.id === parseInt(value));
        if (category) {
          setFormData(prev => ({ ...prev, categorySlug: category.slug }));
        }
      }
    }
  };

  const handleEdit = (product: Product) => {
    navigate(`/admin/products/${product.id}/edit`);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      originalPrice: '',
      image: '',
      categoryId: '',
      categorySlug: '',
      brand: '',
      origin: '',
      stock: '',
      rating: '5.0',
      reviewCount: '0',
      isFlashSale: false,
      flashSaleDiscount: '',
      ingredients: '',
      expiry: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        image: formData.image,
        category: { id: parseInt(formData.categoryId) },
        categorySlug: formData.categorySlug,
        brand: formData.brand,
        origin: formData.origin,
        stock: parseInt(formData.stock),
        sold: 0,
        rating: parseFloat(formData.rating),
        reviewCount: parseInt(formData.reviewCount),
        isFlashSale: formData.isFlashSale,
        flashSaleDiscount: formData.flashSaleDiscount ? parseInt(formData.flashSaleDiscount) : null,
        ingredients: formData.ingredients,
        expiry: formData.expiry,
        images: [],
        weights: [],
        tags: [],
        promotions: [],
      };

      const response = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        setSuccess('✅ Thêm sản phẩm thành công!');
        handleCloseForm();
        loadData();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Không thể thêm sản phẩm');
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await fetch(`http://localhost:8080/api/products/${id}`, {
          method: 'DELETE',
        });
        setSuccess('✅ Xóa sản phẩm thành công!');
        loadData();
      } catch (err) {
        setError('Không thể xóa sản phẩm');
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4 gradient-text fade-in">🛠️ Admin - Quản lý sản phẩm</h1>

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          ❌ {error}
        </Alert>
      )}

      <Row className="mb-4">
        <Col>
          <Button 
            variant="success" 
            size="lg" 
            onClick={() => setShowForm(true)}
            className="shadow"
          >
            ➕ Thêm sản phẩm mới
          </Button>
        </Col>
      </Row>

      {/* Products Table */}
      <Card className="shadow-sm fade-in">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">📦 Danh sách sản phẩm ({products.length})</h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Hình</th>
                <th>Tên</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Kho</th>
                <th>Rating</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      className="rounded"
                    />
                  </td>
                  <td>
                    <div className="fw-bold">{product.name}</div>
                    <small className="text-muted">{product.brand}</small>
                  </td>
                  <td>{product.category?.name}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>
                    <span className={product.stock > 0 ? 'text-success' : 'text-danger'}>
                      {product.stock}
                    </span>
                  </td>
                  <td>⭐ {product.rating}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        ✏️ Sửa
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        🗑️ Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal show={showForm} onHide={handleCloseForm} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            ➕ Thêm sản phẩm mới
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên sản phẩm *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Slug (tự động)</Form.Label>
                  <Form.Control
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá gốc</Form.Label>
                  <Form.Control
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>URL hình ảnh *</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="categoryId">Danh mục *</Form.Label>
                  <Form.Select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                    title="Chọn danh mục sản phẩm"
                    aria-label="Chọn danh mục sản phẩm"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số lượng trong kho *</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Thương hiệu</Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Xuất xứ</Form.Label>
                  <Form.Control
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Đánh giá (0-5)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Số đánh giá</Form.Label>
                  <Form.Control
                    type="number"
                    name="reviewCount"
                    value={formData.reviewCount}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="🔥 Flash Sale"
                    name="isFlashSale"
                    checked={formData.isFlashSale}
                    onChange={handleInputChange}
                    className="mt-4"
                  />
                </Form.Group>
              </Col>
            </Row>

            {formData.isFlashSale && (
              <Form.Group className="mb-3">
                <Form.Label>Giảm giá (%)</Form.Label>
                <Form.Control
                  type="number"
                  name="flashSaleDiscount"
                  value={formData.flashSaleDiscount}
                  onChange={handleInputChange}
                />
              </Form.Group>
            )}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Thành phần</Form.Label>
                  <Form.Control
                    type="text"
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hạn sử dụng</Form.Label>
                  <Form.Control
                    type="text"
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid gap-2">
              <Button variant="success" type="submit" disabled={loading}>
                {loading 
                  ? 'Đang thêm...' 
                  : '✅ Thêm sản phẩm'
                }
              </Button>
              <Button variant="outline-secondary" onClick={handleCloseForm}>
                Hủy
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminPage;

