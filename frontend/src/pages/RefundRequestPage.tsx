import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface RefundRequest {
  orderNumber: string;
  productName: string;
  reason: string;
  description: string;
  refundAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const RefundRequestPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    orderNumber: '',
    productName: '',
    reason: '',
    description: '',
    refundAmount: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Demo data - Danh sách yêu cầu hoàn trả
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([
    {
      orderNumber: 'FM1699999999999',
      productName: 'Táo Fuji',
      reason: 'Hàng bị hỏng',
      description: 'Sản phẩm bị dập khi giao hàng',
      refundAmount: 50000,
      status: 'pending',
      createdAt: '04/11/2025 10:30:00',
    },
    {
      orderNumber: 'FM1699888888888',
      productName: 'Cam Sành',
      reason: 'Sai sản phẩm',
      description: 'Đặt cam sành nhưng nhận được cam canh',
      refundAmount: 35000,
      status: 'approved',
      createdAt: '03/11/2025 15:20:00',
    },
  ]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.orderNumber || !formData.productName || !formData.reason || !formData.description || !formData.refundAmount) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // DEMO MODE: Giả lập tạo yêu cầu hoàn trả
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newRefund: RefundRequest = {
        orderNumber: formData.orderNumber,
        productName: formData.productName,
        reason: formData.reason,
        description: formData.description,
        refundAmount: parseFloat(formData.refundAmount),
        status: 'pending',
        createdAt: new Date().toLocaleString('vi-VN'),
      };

      setRefundRequests((prev) => [newRefund, ...prev]);
      setSuccess(true);
      setShowForm(false);
      
      // Reset form
      setFormData({
        orderNumber: '',
        productName: '',
        reason: '',
        description: '',
        refundAmount: '',
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Không thể tạo yêu cầu hoàn trả. Vui lòng thử lại.');
      console.error('Error creating refund request:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="gradient-text fade-in">🔄 Yêu cầu hoàn trả</h1>
        <Button 
          variant="success" 
          onClick={() => setShowForm(!showForm)}
          className="scale-in"
        >
          {showForm ? '📋 Xem danh sách' : '➕ Tạo yêu cầu mới'}
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="fade-in">
          ❌ {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(false)} className="fade-in">
          ✅ Yêu cầu hoàn trả đã được gửi thành công! Chúng tôi sẽ xử lý trong vòng 24-48 giờ.
        </Alert>
      )}

      {showForm ? (
        <Row>
          <Col lg={8} className="mx-auto">
            <Card className="shadow-sm hover-card fade-in">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0 fw-bold">📝 Tạo yêu cầu hoàn trả</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mã đơn hàng *</Form.Label>
                    <Form.Control
                      type="text"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleInputChange}
                      placeholder="Ví dụ: FM1699999999999"
                      required
                    />
                    <Form.Text className="text-muted">
                      Nhập mã đơn hàng muốn hoàn trả (bạn có thể tìm trong mục "Đơn hàng")
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Tên sản phẩm *</Form.Label>
                    <Form.Control
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleInputChange}
                      placeholder="Ví dụ: Táo Fuji"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Lý do hoàn trả *</Form.Label>
                    <Form.Select
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      required
                      aria-label="Chọn lý do hoàn trả"
                    >
                      <option value="">Chọn lý do...</option>
                      <option value="Hàng bị hỏng">Hàng bị hỏng</option>
                      <option value="Sai sản phẩm">Sai sản phẩm</option>
                      <option value="Không đúng mô tả">Không đúng mô tả</option>
                      <option value="Giao hàng trễ">Giao hàng trễ</option>
                      <option value="Đổi ý">Đổi ý không muốn mua nữa</option>
                      <option value="Khác">Khác</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mô tả chi tiết *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Mô tả chi tiết vấn đề của sản phẩm..."
                      required
                    />
                    <Form.Text className="text-muted">
                      Vui lòng mô tả rõ ràng để chúng tôi xử lý nhanh hơn
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Số tiền hoàn trả (VNĐ) *</Form.Label>
                    <Form.Control
                      type="number"
                      name="refundAmount"
                      value={formData.refundAmount}
                      onChange={handleInputChange}
                      placeholder="Ví dụ: 50000"
                      required
                      min="0"
                    />
                  </Form.Group>

                  <Alert variant="info" className="mb-3">
                    <strong>📌 Lưu ý:</strong>
                    <ul className="mb-0 mt-2">
                      <li>Yêu cầu hoàn trả sẽ được xử lý trong vòng 24-48 giờ</li>
                      <li>Sản phẩm cần còn nguyên vẹn, chưa qua sử dụng</li>
                      <li>Phí vận chuyển hoàn trả có thể áp dụng tùy trường hợp</li>
                      <li>Tiền sẽ được hoàn về tài khoản trong 5-7 ngày làm việc</li>
                    </ul>
                  </Alert>

                  <div className="d-flex gap-2">
                    <Button 
                      variant="success" 
                      type="submit" 
                      disabled={loading}
                      className="flex-grow-1"
                    >
                      {loading ? '⏳ Đang gửi...' : '✅ Gửi yêu cầu'}
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setShowForm(false)}
                      disabled={loading}
                    >
                      ← Hủy
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Card className="shadow-sm fade-in">
          <Card.Header className="bg-light">
            <h5 className="mb-0 fw-bold">📋 Danh sách yêu cầu hoàn trả</h5>
          </Card.Header>
          <Card.Body>
            {refundRequests.length === 0 ? (
              <Alert variant="info" className="text-center">
                <h5>📭 Chưa có yêu cầu hoàn trả nào</h5>
                <p>Nhấn nút "Tạo yêu cầu mới" để bắt đầu</p>
              </Alert>
            ) : (
              <div className="table-responsive">
                <Table hover>
                  <thead className="table-success">
                    <tr>
                      <th>Mã đơn hàng</th>
                      <th>Sản phẩm</th>
                      <th>Lý do</th>
                      <th>Số tiền</th>
                      <th>Ngày tạo</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refundRequests.map((request, index) => (
                      <tr key={index} className="align-middle">
                        <td className="fw-bold text-primary">{request.orderNumber}</td>
                        <td>{request.productName}</td>
                        <td>{request.reason}</td>
                        <td className="fw-bold text-danger">{formatPrice(request.refundAmount)}</td>
                        <td className="text-muted small">{request.createdAt}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => {
                              alert(`Chi tiết:\n\nMã đơn: ${request.orderNumber}\nSản phẩm: ${request.productName}\nLý do: ${request.reason}\nMô tả: ${request.description}\nSố tiền: ${formatPrice(request.refundAmount)}`);
                            }}
                          >
                            👁️ Chi tiết
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default RefundRequestPage;

