import React from 'react';
import { Container, Row, Col, Card, Button, Table, Image, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <Container className="py-5">
        <Alert variant="info" className="text-center">
          <h4>🛒 Giỏ hàng trống</h4>
          <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <Link to="/products">
            <Button variant="success">Tiếp tục mua sắm</Button>
          </Link>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4 gradient-text fade-in">🛒 Giỏ hàng của bạn</h1>

      <Row>
        <Col lg={8} className="slide-in-left">
          <Card className="shadow-sm mb-4 hover-card">
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Tổng</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.product.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <Image
                            src={item.product.image || 'https://via.placeholder.com/80'}
                            alt={item.product.name}
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            rounded
                          />
                          <div className="ms-3">
                            <Link 
                              to={`/product/${item.product.slug}`} 
                              className="text-decoration-none text-dark fw-bold"
                            >
                              {item.product.name}
                            </Link>
                            {item.product.brand && (
                              <div className="text-muted small">
                                {item.product.brand}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="align-middle">
                        <div className="fw-bold text-success">
                          {formatPrice(item.product.price)}
                        </div>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex align-items-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="mx-3 fw-bold">{item.quantity}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            +
                          </Button>
                        </div>
                        <div className="text-muted small mt-1">
                          Kho: {item.product.stock}
                        </div>
                      </td>
                      <td className="align-middle">
                        <div className="fw-bold text-success">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                      </td>
                      <td className="align-middle">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          🗑️
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Link to="/products">
            <Button variant="outline-success">← Tiếp tục mua sắm</Button>
          </Link>
        </Col>

        <Col lg={4} className="slide-in-right">
          <Card className="shadow-sm sticky-top hover-card" style={{ top: '20px' }}>
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">📋 Thông tin đơn hàng</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Tổng sản phẩm:</span>
                <span className="fw-bold">{getTotalItems()}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-3">
                <span>Tạm tính:</span>
                <span className="fw-bold">{formatPrice(getTotalPrice())}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-3">
                <span className="fw-bold">Tổng cộng:</span>
                <span className="fw-bold text-success fs-4">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>

              <div className="d-grid">
                <Button variant="success" size="lg" onClick={handleCheckout}>
                  Tiến hành đặt hàng
                </Button>
              </div>

              <div className="mt-3 text-center">
                <small className="text-muted">
                  🚚 Miễn phí vận chuyển cho đơn hàng từ 200.000đ
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;

