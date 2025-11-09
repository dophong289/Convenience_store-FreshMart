import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, InputGroup, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { productService } from '../api/productService';
import { Product } from '../types';

const InventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, in-stock, low-stock, out-of-stock
  
  // Modal for quick update
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newStock, setNewStock] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, filterStatus]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts();
      setProducts(response.data || []);
    } catch (err) {
      setError('Không thể tải dữ liệu sản phẩm');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus === 'in-stock') {
      filtered = filtered.filter(p => p.stock > 20);
    } else if (filterStatus === 'low-stock') {
      filtered = filtered.filter(p => p.stock > 0 && p.stock <= 20);
    } else if (filterStatus === 'out-of-stock') {
      filtered = filtered.filter(p => p.stock === 0);
    }

    setFilteredProducts(filtered);
  };

  const handleUpdateStock = async () => {
    if (!selectedProduct) return;

    try {
      const updatedProduct = {
        ...selectedProduct,
        stock: parseInt(newStock),
        category: { id: selectedProduct.category.id },
      };

      await fetch(`http://localhost:8080/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });

      setSuccess(`Đã cập nhật tồn kho cho "${selectedProduct.name}"`);
      setShowUpdateModal(false);
      loadProducts();
    } catch (err) {
      setError('Không thể cập nhật tồn kho');
    }
  };

  const openUpdateModal = (product: Product) => {
    setSelectedProduct(product);
    setNewStock(product.stock.toString());
    setShowUpdateModal(true);
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge bg="danger">Hết hàng</Badge>;
    if (stock <= 20) return <Badge bg="warning" text="dark">Sắp hết</Badge>;
    return <Badge bg="success">Còn hàng</Badge>;
  };

  const getTotalInventoryValue = () => {
    return products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  };

  const getLowStockCount = () => {
    return products.filter(p => p.stock > 0 && p.stock <= 20).length;
  };

  const getOutOfStockCount = () => {
    return products.filter(p => p.stock === 0).length;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
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

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 fade-in">
        <div>
          <h1 className="gradient-text mb-2">📦 Quản lý Tồn kho</h1>
          <p className="text-muted">Theo dõi và quản lý số lượng sản phẩm</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={() => navigate('/inventory/supplier-orders')}>
            Quản lý đơn NCC
          </Button>
          <Button variant="success" onClick={loadProducts}>
            dY", Refresh
          </Button>
        </div>
      </div>

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          ✅ {success}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          ❌ {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow-sm hover-card border-0 scale-in">
            <Card.Body className="text-center">
              <div className="display-6 text-primary mb-2">📊</div>
              <h6 className="text-muted mb-1">Tổng sản phẩm</h6>
              <h3 className="fw-bold mb-0">{products.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm hover-card border-0 scale-in" style={{ animationDelay: '0.1s' }}>
            <Card.Body className="text-center">
              <div className="display-6 text-success mb-2">💰</div>
              <h6 className="text-muted mb-1">Giá trị tồn kho</h6>
              <h5 className="fw-bold mb-0 text-success">
                {formatPrice(getTotalInventoryValue())}
              </h5>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm hover-card border-0 scale-in" style={{ animationDelay: '0.2s' }}>
            <Card.Body className="text-center">
              <div className="display-6 text-warning mb-2">⚠️</div>
              <h6 className="text-muted mb-1">Sắp hết hàng</h6>
              <h3 className="fw-bold mb-0 text-warning">{getLowStockCount()}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm hover-card border-0 scale-in" style={{ animationDelay: '0.3s' }}>
            <Card.Body className="text-center">
              <div className="display-6 text-danger mb-2">❌</div>
              <h6 className="text-muted mb-1">Hết hàng</h6>
              <h3 className="fw-bold mb-0 text-danger">{getOutOfStockCount()}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                aria-label="Lọc theo trạng thái"
              >
                <option value="all">Tất cả sản phẩm</option>
                <option value="in-stock">Còn hàng ({">"} 20)</option>
                <option value="low-stock">Sắp hết (1-20)</option>
                <option value="out-of-stock">Hết hàng (0)</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Inventory Table */}
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">📋 Danh sách tồn kho ({filteredProducts.length})</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>ID</th>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th className="text-center">Tồn kho</th>
                <th className="text-center">Đã bán</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-center">Giá trị</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="align-middle">{product.id}</td>
                  <td className="align-middle">
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      className="rounded"
                    />
                  </td>
                  <td className="align-middle">
                    <div className="fw-bold">{product.name}</div>
                    {product.brand && (
                      <small className="text-muted">{product.brand}</small>
                    )}
                  </td>
                  <td className="align-middle">
                    <Badge bg="secondary">{product.category?.name}</Badge>
                  </td>
                  <td className="align-middle">
                    <span className="fw-bold text-success">
                      {formatPrice(product.price)}
                    </span>
                  </td>
                  <td className="align-middle text-center">
                    <span
                      className={`fw-bold ${
                        product.stock === 0
                          ? 'text-danger'
                          : product.stock <= 20
                          ? 'text-warning'
                          : 'text-success'
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="align-middle text-center">{product.sold}</td>
                  <td className="align-middle text-center">
                    {getStockBadge(product.stock)}
                  </td>
                  <td className="align-middle text-center">
                    <span className="fw-bold">
                      {formatPrice(product.price * product.stock)}
                    </span>
                  </td>
                  <td className="align-middle text-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => openUpdateModal(product)}
                    >
                      📝 Cập nhật
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-5">
              <p className="text-muted">Không tìm thấy sản phẩm nào</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Update Stock Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>📝 Cập nhật Tồn kho</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <div className="mb-3">
                <strong>Sản phẩm:</strong> {selectedProduct.name}
              </div>
              <div className="mb-3">
                <strong>Tồn kho hiện tại:</strong>{' '}
                <Badge
                  bg={
                    selectedProduct.stock === 0
                      ? 'danger'
                      : selectedProduct.stock <= 20
                      ? 'warning'
                      : 'success'
                  }
                >
                  {selectedProduct.stock}
                </Badge>
              </div>
              <Form.Group>
                <Form.Label>Số lượng mới:</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  placeholder="Nhập số lượng mới"
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleUpdateStock}>
            ✅ Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default InventoryPage;

