import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  ListGroup,
  Modal,
  Row,
  Table,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { productService } from '../api/productService';
import { supplierService } from '../api/supplierService';
import { supplierOrderService } from '../api/supplierOrderService';
import { Product, Supplier, SupplierOrder } from '../types';

type OrderItemRow = {
  key: string;
  productId: number | '';
  quantity: number;
  unitPrice: number;
};

const createEmptyItem = (): OrderItemRow => ({
  key: `${Date.now()}-${Math.random()}`,
  productId: '',
  quantity: 1,
  unitPrice: 0,
});

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const formatDateInput = (date: Date) => date.toISOString().slice(0, 10);

const SupplierOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orderDate, setOrderDate] = useState(formatDateInput(new Date()));
  const [expectedDate, setExpectedDate] = useState(
    formatDateInput(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000))
  );
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<OrderItemRow[]>([createEmptyItem()]);
  const [orders, setOrders] = useState<SupplierOrder[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [supplierRes, productRes, orderRes] = await Promise.all([
          supplierService.getSuppliers(),
          productService.getProducts({ size: 1000 }),
          supplierOrderService.getOrders(),
        ]);
        setSuppliers(supplierRes.data || []);
        setProducts(productRes.data || []);
        setOrders(orderRes.data || []);
      } catch (err: any) {
        console.error('Error loading supplier order page:', err);
        setError(err?.message || 'Không thể tải dữ liệu ban đầu');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const supplierDetail = useMemo(() => {
    if (!selectedSupplierId) return undefined;
    return suppliers.find((supplier) => supplier.id === selectedSupplierId);
  }, [selectedSupplierId, suppliers]);

  const handleItemChange = (rowKey: string, field: keyof OrderItemRow, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.key !== rowKey) return item;
        const updated = { ...item };
        if (field === 'productId') {
          updated.productId = value === '' ? '' : Number(value);
          const product = products.find((p) => p.id === updated.productId);
          if (product) {
            updated.unitPrice = product.price;
          }
        } else if (field === 'quantity') {
          updated.quantity = Math.max(1, Number(value));
        } else if (field === 'unitPrice') {
          updated.unitPrice = Math.max(0, Number(value));
        }
        return updated;
      })
    );
  };

  const handleAddItem = () => {
    setItems((prev) => [...prev, createEmptyItem()]);
  };

  const handleRemoveItem = (rowKey: string) => {
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((item) => item.key !== rowKey)));
  };

  const orderTotal = useMemo(() => {
    return items.reduce((sum, item) => {
      if (!item.productId) return sum;
      return sum + item.quantity * item.unitPrice;
    }, 0);
  }, [items]);

  const resetForm = () => {
    setOrderDate(formatDateInput(new Date()));
    setExpectedDate(formatDateInput(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)));
    setSelectedSupplierId('');
    setNotes('');
    setItems([createEmptyItem()]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedSupplierId) {
      setError('Vui lòng chọn nhà cung cấp');
      return;
    }

    const validItems = items.filter((item) => item.productId && item.quantity > 0 && item.unitPrice > 0);
    if (validItems.length === 0) {
      setError('Cần chọn ít nhất một sản phẩm và số lượng hợp lệ');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        orderDate,
        expectedDeliveryDate: expectedDate || null,
        supplierId: Number(selectedSupplierId),
        notes,
        items: validItems.map((item) => ({
          productId: Number(item.productId),
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      };

      const response = await supplierOrderService.createOrder(payload);
      setSuccess(response.message || `Đã tạo đơn hàng #${response.data.orderNumber}`);
      setOrders((prev) => [response.data, ...prev]);
      resetForm();
    } catch (submitError: any) {
      if (submitError?.errors) {
        const firstError = Object.values(submitError.errors)[0] as string;
        setError(firstError);
      } else {
        setError(submitError?.message || 'Không thể tạo đơn hàng mới');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSupplier = async () => {
    if (!newSupplier.name.trim()) {
      setError('Tên nhà cung cấp không được để trống');
      return;
    }

    try {
      setLoading(true);
      const response = await supplierService.createSupplier({
        name: newSupplier.name.trim(),
        contactName: newSupplier.contactName.trim() || undefined,
        email: newSupplier.email.trim() || undefined,
        phone: newSupplier.phone.trim() || undefined,
        address: newSupplier.address.trim() || undefined,
      });
      setSuppliers((prev) => [...prev, response.data]);
      setSelectedSupplierId(response.data.id);
      setSuccess(response.message || 'Đã thêm nhà cung cấp mới');
      setShowSupplierModal(false);
      setNewSupplier({ name: '', contactName: '', email: '', phone: '', address: '' });
    } catch (err: any) {
      setError(err?.message || 'Không thể tạo nhà cung cấp mới');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="gx-4">
        <Col md={3} lg={2} className="mb-4">
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white fw-bold">Quản lý kho</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item action onClick={() => navigate('/inventory')}>
                Stock Monitoring
              </ListGroup.Item>
              <ListGroup.Item active>Supplier Orders</ListGroup.Item>
              <ListGroup.Item>Inventory Reports</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        <Col md={9} lg={10}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Quản lý Đơn hàng Nhà cung cấp</h2>
              <p className="text-muted mb-0">Theo dõi và tạo đơn nhập hàng từ nhà cung cấp</p>
            </div>
            <Button variant="outline-primary" onClick={() => setShowSupplierModal(true)}>
              + Thêm Nhà cung cấp
            </Button>
          </div>

          {success && (
            <Alert variant="success" dismissible onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} className="mb-4">
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-white fw-semibold">Thông tin Đơn hàng</Card.Header>
              <Card.Body>
                <Row className="g-4">
                  <Col md={6}>
                    <FloatingLabel controlId="orderDate" label="Ngày đặt hàng">
                      <Form.Control
                        type="date"
                        value={orderDate}
                        onChange={(event) => setOrderDate(event.target.value)}
                        required
                      />
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel controlId="expectedDate" label="Ngày giao hàng dự kiến">
                      <Form.Control
                        type="date"
                        value={expectedDate}
                        onChange={(event) => setExpectedDate(event.target.value)}
                      />
                    </FloatingLabel>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-white fw-semibold d-flex justify-content-between align-items-center">
                <span>Thông tin Nhà cung cấp</span>
                <Button size="sm" variant="outline-secondary" onClick={() => setShowSupplierModal(true)}>
                  Thêm Nhà cung cấp
                </Button>
              </Card.Header>
              <Card.Body>
                <Row className="g-4">
                  <Col md={6}>
                    <FloatingLabel controlId="supplier" label="Nhà cung cấp">
                      <Form.Select
                        value={selectedSupplierId}
                        onChange={(event) =>
                          setSelectedSupplierId(event.target.value ? Number(event.target.value) : '')
                        }
                        required
                      >
                        <option value="">Chọn nhà cung cấp</option>
                        {suppliers.map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel controlId="contact" label="Người liên hệ">
                      <Form.Control value={supplierDetail?.contactName || ''} readOnly placeholder=" " />
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel controlId="email" label="Email">
                      <Form.Control type="email" value={supplierDetail?.email || ''} readOnly placeholder=" " />
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel controlId="phone" label="Số điện thoại">
                      <Form.Control value={supplierDetail?.phone || ''} readOnly placeholder=" " />
                    </FloatingLabel>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-white fw-semibold d-flex justify-content-between align-items-center">
                <span>Chọn Sản phẩm</span>
                <Button variant="outline-primary" size="sm" onClick={handleAddItem}>
                  + Thêm Sản phẩm
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive hover className="align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th style={{ minWidth: 220 }}>Sản phẩm</th>
                      <th className="text-center">Số lượng</th>
                      <th className="text-center">Đơn giá</th>
                      <th className="text-end" style={{ minWidth: 160 }}>Thành tiền</th>
                      <th className="text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      const product = products.find((p) => p.id === item.productId);
                      const lineTotal = item.quantity * item.unitPrice;

                      return (
                        <tr key={item.key}>
                          <td>
                            <Form.Select
                              value={item.productId}
                              onChange={(event) => handleItemChange(item.key, 'productId', event.target.value)}
                              required
                            >
                              <option value="">Chọn sản phẩm</option>
                              {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name}
                                </option>
                              ))}
                            </Form.Select>
                          </td>
                          <td className="text-center" style={{ width: 120 }}>
                            <Form.Control
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(event) => handleItemChange(item.key, 'quantity', event.target.value)}
                            />
                          </td>
                          <td className="text-center" style={{ width: 160 }}>
                            <Form.Control
                              type="number"
                              min={0}
                              value={item.unitPrice}
                              onChange={(event) => handleItemChange(item.key, 'unitPrice', event.target.value)}
                            />
                          </td>
                          <td className="text-end">
                            <div className="fw-semibold">{formatCurrency(lineTotal)}</div>
                            {product && (
                              <small className="text-muted">Giá chuẩn: {formatCurrency(product.price)}</small>
                            )}
                          </td>
                          <td className="text-center" style={{ width: 80 }}>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleRemoveItem(item.key)}
                              disabled={items.length === 1}
                            >
                              ×
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-white fw-semibold">Ghi chú Đơn hàng</Card.Header>
              <Card.Body>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Thêm ghi chú đặc biệt, hướng dẫn giao hàng..."
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </Card.Body>
            </Card>

            <Card className="shadow-sm border-0 mb-4">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted">Tổng cộng dự kiến:</span>
                  <h4 className="mb-0">{formatCurrency(orderTotal)}</h4>
                </div>
                <Button variant="primary" size="lg" type="submit" disabled={loading}>
                  {loading ? 'Đang xử lý...' : 'Gửi Đơn hàng'}
                </Button>
              </Card.Body>
            </Card>
          </Form>

          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white fw-semibold">Đơn hàng gần đây</Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Mã đơn</th>
                    <th>Nhà cung cấp</th>
                    <th>Ngày đặt</th>
                    <th>Dự kiến giao</th>
                    <th className="text-end">Tổng tiền</th>
                    <th className="text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted">
                        Chưa có đơn hàng nhà cung cấp nào
                      </td>
                    </tr>
                  )}
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="fw-semibold">{order.orderNumber}</td>
                      <td>{order.supplier?.name}</td>
                      <td>{order.orderDate || '-'}</td>
                      <td>{order.expectedDeliveryDate || '-'}</td>
                      <td className="text-end">{formatCurrency(order.totalAmount || 0)}</td>
                      <td className="text-center">
                        <Badge bg="info" text="dark">
                          {order.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showSupplierModal} onHide={() => setShowSupplierModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm Nhà cung cấp</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên nhà cung cấp *</Form.Label>
              <Form.Control
                value={newSupplier.name}
                onChange={(event) => setNewSupplier((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Người liên hệ</Form.Label>
              <Form.Control
                value={newSupplier.contactName}
                onChange={(event) => setNewSupplier((prev) => ({ ...prev, contactName: event.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newSupplier.email}
                onChange={(event) => setNewSupplier((prev) => ({ ...prev, email: event.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                value={newSupplier.phone}
                onChange={(event) => setNewSupplier((prev) => ({ ...prev, phone: event.target.value }))}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={newSupplier.address}
                onChange={(event) => setNewSupplier((prev) => ({ ...prev, address: event.target.value }))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSupplierModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleCreateSupplier} disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu nhà cung cấp'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SupplierOrdersPage;
