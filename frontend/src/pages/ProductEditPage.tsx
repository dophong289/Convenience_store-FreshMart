import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from 'react-bootstrap';
import { categoryService } from '../api/categoryService';
import {
  ProductManagementDetail,
  ProductUpdatePayload,
  productService,
} from '../api/productService';
import { Category, ProductStatus } from '../types';

type FormState = {
  name: string;
  categoryId: string;
  stock: string;
  status: ProductStatus;
  updatedAt?: string;
  image: string;
  description?: string;
};

const statusOptions: { value: ProductStatus; label: string }[] = [
  { value: 'IN_STOCK', label: 'Còn hàng' },
  { value: 'LOW_STOCK', label: 'Sắp hết' },
  { value: 'OUT_OF_STOCK', label: 'Hết hàng' },
  { value: 'DISCONTINUED', label: 'Ngừng kinh doanh' },
];

const ProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [product, setProduct] = useState<ProductManagementDetail | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formState, setFormState] = useState<FormState>({
    name: '',
    categoryId: '',
    stock: '0',
    status: 'IN_STOCK',
    image: '',
  });

  const productId = useMemo(() => (id ? parseInt(id, 10) : NaN), [id]);

  useEffect(() => {
    if (Number.isNaN(productId)) {
      setError('Mã sản phẩm không hợp lệ');
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productRes, categoryRes] = await Promise.all([
          productService.getProductForManagement(productId),
          categoryService.getAllCategories(),
        ]);

        setProduct(productRes.data);
        setCategories(categoryRes.data);
        setFormState({
          name: productRes.data.name,
          categoryId: productRes.data.category.id.toString(),
          stock: productRes.data.stock.toString(),
          status: productRes.data.status,
          image: productRes.data.image,
          description: productRes.data.description,
          updatedAt: productRes.data.updatedAt,
        });
      } catch (fetchError: any) {
        setError(fetchError?.message || 'Không thể tải thông tin sản phẩm');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormState((prev) => ({
      ...prev,
      status: event.target.value as ProductStatus,
    }));
  };

  const handleImageChange = () => {
    const newUrl = window.prompt('Nhập URL hình ảnh mới', formState.image);
    if (newUrl) {
      setFormState((prev) => ({ ...prev, image: newUrl }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!product) {
      return;
    }

    if (!formState.name.trim()) {
      setError('Tên sản phẩm là bắt buộc');
      return;
    }

    if (!formState.categoryId) {
      setError('Danh mục là bắt buộc');
      return;
    }

    const stockValue = Number(formState.stock);
    if (Number.isNaN(stockValue) || stockValue < 0) {
      setError('Số lượng tồn kho phải là số không âm');
      return;
    }

    const payload: ProductUpdatePayload = {
      name: formState.name.trim(),
      slug: product.slug,
      description: formState.description,
      price: product.price,
      originalPrice: product.originalPrice ?? null,
      image: formState.image.trim(),
      images: product.images ?? [],
      categoryId: parseInt(formState.categoryId, 10),
      categorySlug: categorySlugValue,
      brand: product.brand,
      origin: product.origin,
      stock: stockValue,
      sold: product.sold,
      status: formState.status,
      isFlashSale: product.isFlashSale,
      flashSaleDiscount: product.flashSaleDiscount ?? null,
      tags: product.tags ?? [],
      promotions: product.promotions ?? [],
      ingredients: product.ingredients,
      expiry: product.expiry,
      rating: product.rating,
      reviewCount: product.reviewCount,
    };

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await productService.updateProduct(product.id, payload);
      setProduct(response.data);
      setFormState((prev) => ({
        ...prev,
        updatedAt: response.data.updatedAt,
      }));
      setSuccess('Cập nhật sản phẩm thành công');
    } catch (submitError: any) {
      if (submitError?.errors) {
        const firstError = Object.values(submitError.errors)[0] as string;
        setError(firstError || 'Không thể cập nhật sản phẩm');
      } else {
        setError(submitError?.message || 'Không thể cập nhật sản phẩm');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/admin');
    }
  };

  const selectedCategory = useMemo(() => {
    return categories.find((cat) => cat.id === Number(formState.categoryId));
  }, [categories, formState.categoryId]);

  const categorySlugValue = selectedCategory?.slug ?? product?.categorySlug ?? '';

  const lastUpdatedLabel = useMemo(() => {
    if (!formState.updatedAt) {
      return '—';
    }
    try {
      const date = new Date(formState.updatedAt);
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (err) {
      return formState.updatedAt;
    }
  }, [formState.updatedAt]);

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error && !product) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={handleCancel}>
          Quay lại
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>
          Quản lý sản phẩm
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Cập nhật sản phẩm</Breadcrumb.Item>
      </Breadcrumb>

      <h2 className="mb-4">Cập nhật thông tin sản phẩm</h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Row className="g-4">
        <Col lg={4}>
          <Card className="h-100">
            <Card.Header>Hình ảnh sản phẩm</Card.Header>
            <Card.Body className="d-flex flex-column">
              <div className="ratio ratio-1x1 mb-3 border rounded overflow-hidden bg-light">
                {formState.image ? (
                  <img
                    src={formState.image}
                    alt={formState.name}
                    className="w-100 h-100 object-fit-cover"
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center text-muted">
                    Chưa có hình ảnh
                  </div>
                )}
              </div>
              <Button variant="outline-primary" onClick={handleImageChange} className="mb-3">
                Thay đổi ảnh
              </Button>
              <Form.Group controlId="productImageUrl" className="mb-3">
                <Form.Label>URL hình ảnh</Form.Label>
                <Form.Control
                  type="text"
                  name="image"
                  value={formState.image}
                  onChange={handleInputChange}
                  placeholder="https://cdn.store.com/image.jpg"
                />
              </Form.Group>
              <div className="text-muted small mt-auto">
                Danh mục hiện tại: {selectedCategory ? selectedCategory.name : product?.category?.name ?? '—'}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card>
            <Card.Header>Chi tiết sản phẩm</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="g-4">
                  <Col md={6}>
                    <Form.Group controlId="productId">
                      <Form.Label>Mã sản phẩm</Form.Label>
                      <Form.Control type="text" value={product?.id ?? ''} readOnly />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="productSlug">
                      <Form.Label>Slug</Form.Label>
                      <Form.Control type="text" value={product?.slug ?? ''} readOnly />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group controlId="productName">
                      <Form.Label>Tên sản phẩm *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formState.name}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group controlId="productDescription">
                      <Form.Label>Mô tả</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formState.description || ''}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="productCategory">
                      <Form.Label>Danh mục *</Form.Label>
                      <Form.Select
                        name="categoryId"
                        value={formState.categoryId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Chọn danh mục</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="productStock">
                      <Form.Label>Số lượng tồn kho *</Form.Label>
                      <Form.Control
                        type="number"
                        name="stock"
                        min={0}
                        value={formState.stock}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="productStatus">
                      <Form.Label>Trạng thái *</Form.Label>
                      <Form.Select value={formState.status} onChange={handleStatusChange}>
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="productUpdatedAt">
                      <Form.Label>Cập nhật lần cuối</Form.Label>
                      <Form.Control type="text" value={lastUpdatedLabel} readOnly />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-3 mt-4">
                  <Button variant="outline-secondary" onClick={handleCancel}>
                    Đóng
                  </Button>
                  <Button variant="primary" type="submit" disabled={isSaving}>
                    {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductEditPage;
