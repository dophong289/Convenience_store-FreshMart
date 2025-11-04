import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../api/orderService';
import Invoice from '../components/Invoice';

const CheckoutPage: React.FC = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.deliveryAddress) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const newOrderData = {
        ...formData,
        totalAmount: getTotalPrice(),
        items: cartItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity,
        })),
        orderNumber: `FM${Date.now()}`,
        orderDate: new Date().toLocaleString('vi-VN'),
      };

      // DEMO MODE: Giả lập thanh toán thành công mà không cần gọi API
      // Bỏ comment dòng dưới nếu muốn gọi API thật
      // const response = await orderService.createOrder(newOrderData);
      
      // Giả lập delay 1 giây để có cảm giác thật
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Giả lập thành công
      setSuccess(true);
      setOrderData(newOrderData);
      clearCart(); // Xóa giỏ hàng sau khi thanh toán thành công
      
    } catch (err: any) {
      setError(err.message || 'Không thể thanh toán. Vui lòng thử lại.');
      console.error('Error processing payment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleShowInvoice = () => {
    setShowInvoice(true);
  };

  const handleCloseInvoice = () => {
    setShowInvoice(false);
  };

  if (cartItems.length === 0 && !success) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <h4>⚠️ Giỏ hàng trống</h4>
          <p>Bạn cần thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
          <Button variant="success" onClick={() => navigate('/products')}>
            Tiếp tục mua sắm
          </Button>
        </Alert>
      </Container>
    );
  }

  if (success) {
    return (
      <>
        <Container className="py-5">
          <Alert variant="success" className="text-center fade-in" style={{ animation: 'scaleIn 0.5s ease-out' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ color: '#28a745', fontWeight: 'bold', fontSize: '2.5rem' }}>
              💳 Thanh toán thành công!
            </h2>
            <p className="lead" style={{ fontSize: '1.3rem', marginTop: '1rem' }}>
              Cảm ơn bạn đã mua hàng tại FreshMart
            </p>
            <p style={{ fontSize: '1.1rem' }}>
              Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn
            </p>
            
            {orderData && (
              <div className="mt-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                <p className="fw-bold mb-2" style={{ fontSize: '1.2rem' }}>
                  📋 Mã đơn hàng: <span style={{ color: '#28a745' }}>{orderData.orderNumber}</span>
                </p>
                <p className="fw-bold mb-0" style={{ fontSize: '1.2rem' }}>
                  💰 Tổng tiền: <span style={{ color: '#dc3545' }}>{formatPrice(orderData.totalAmount)}</span>
                </p>
              </div>
            )}
            
            <hr />
            
            <div className="d-flex flex-column gap-3 align-items-center mt-4">
              <div className="d-flex gap-3">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleShowInvoice}
                  style={{ minWidth: '180px', fontWeight: 'bold' }}
                >
                  📄 Xem hóa đơn
                </Button>
                <Button 
                  variant="success" 
                  size="lg"
                  onClick={handlePrintInvoice}
                  style={{ minWidth: '180px', fontWeight: 'bold' }}
                >
                  🖨️ In hóa đơn
                </Button>
              </div>
              <Button 
                variant="outline-secondary" 
                size="lg"
                onClick={() => navigate('/')}
                style={{ minWidth: '200px' }}
              >
                🏠 Về trang chủ
              </Button>
            </div>
          </Alert>
        </Container>

        {/* Invoice Modal */}
        <Modal 
          show={showInvoice} 
          onHide={handleCloseInvoice} 
          size="xl"
          centered
        >
          <Modal.Header closeButton className="no-print">
            <Modal.Title>Hóa đơn đơn hàng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {orderData && (
              <Invoice
                orderNumber={orderData.orderNumber}
                customerName={orderData.customerName}
                customerEmail={orderData.customerEmail}
                customerPhone={orderData.customerPhone}
                deliveryAddress={orderData.deliveryAddress}
                items={orderData.items}
                totalAmount={orderData.totalAmount}
                orderDate={orderData.orderDate}
              />
            )}
          </Modal.Body>
          <Modal.Footer className="no-print">
            <Button variant="secondary" onClick={handleCloseInvoice}>
              Đóng
            </Button>
            <Button variant="success" onClick={handlePrintInvoice}>
              🖨️ In hóa đơn
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4 gradient-text fade-in">💳 Thanh toán</h1>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          ❌ {error}
        </Alert>
      )}

      <Row>
        <Col lg={7} className="slide-in-left">
          <Card className="shadow-sm mb-4 hover-card">
            <Card.Header className="bg-light">
              <h5 className="mb-0 fw-bold">📋 Thông tin giao hàng</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên *</Form.Label>
                  <Form.Control
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    placeholder="0xxxxxxxxx"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Địa chỉ giao hàng *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ chi tiết"
                    required
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button 
                    variant="success" 
                    type="submit" 
                    disabled={loading}
                    className="flex-grow-1"
                    size="lg"
                    style={{ fontWeight: 'bold' }}
                  >
                    {loading ? '⏳ Đang xử lý thanh toán...' : '💳 Xác nhận thanh toán'}
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/cart')}
                    disabled={loading}
                  >
                    ← Quay lại
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5} className="slide-in-right">
          <Card className="shadow-sm mb-4 hover-card">
            <Card.Header className="bg-light">
              <h5 className="mb-0 fw-bold">🛒 Đơn hàng của bạn</h5>
            </Card.Header>
            <Card.Body>
              <Table borderless size="sm">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th className="text-end">Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.product.id}>
                      <td>
                        <div className="fw-bold">{item.product.name}</div>
                        <div className="text-muted small">
                          {formatPrice(item.product.price)} × {item.quantity}
                        </div>
                      </td>
                      <td className="text-end align-middle">
                        {formatPrice(item.product.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Tạm tính:</span>
                <span className="fw-bold">{formatPrice(getTotalPrice())}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Phí vận chuyển:</span>
                <span className="text-success fw-bold">Miễn phí</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between">
                <span className="fw-bold fs-5">Tổng cộng:</span>
                <span className="fw-bold text-success fs-4">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
            </Card.Body>
          </Card>

          <Card className="shadow-sm border-success">
            <Card.Body className="text-center">
              <div className="mb-2">🚚 Miễn phí vận chuyển</div>
              <div className="mb-2">📦 Giao hàng trong 2-3 ngày</div>
              <div>💯 Cam kết chất lượng</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;

