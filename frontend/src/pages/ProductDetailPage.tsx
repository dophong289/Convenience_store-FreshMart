import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Image,
  Spinner,
  Alert,
  Button,
  Badge,
  Card,
  Form,
} from "react-bootstrap";
import { Product } from "../types";
import { productService } from "../api/productService";
import ProductCard from "../components/ProductCard";

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (slug) loadProduct(slug);
  }, [slug]);

  const loadProduct = async (slug: string) => {
    try {
      setLoading(true);
      const response = await productService.getProductBySlug(slug);
      setProduct(response.data);
      if (response.data?.categorySlug) {
        const relatedRes = await productService.getProducts({
          category: response.data.categorySlug,
          size: 4,
        });
        setRelated(relatedRes.data || []);
      }
    } catch (err: any) {
      console.error("Error loading product:", err);
      setError(err.message || "Không thể tải thông tin sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-2">Đang tải thông tin sản phẩm...</p>
      </Container>
    );

  if (error)
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  if (!product)
    return (
      <Container className="py-5">
        <Alert variant="info">Không tìm thấy sản phẩm</Alert>
      </Container>
    );

  return (
    <Container className="py-5 fade-in">
      {/* Inline CSS */}
      <style>{`
        .fade-in { animation: fadeIn 0.6s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .hover-scale:hover { transform: scale(1.02); transition: transform 0.3s ease; }
        .shadow-sm { box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
        .fw-bold { font-weight: 600; }
        .price-text { font-size: 1.4rem; color: #dc3545; font-weight: 700; }
        .btn-buy { background-color: #28a745; border: none; font-weight: 600; }
        .btn-cart { background-color: #ffc107; border: none; font-weight: 600; color: #212529; }
        .btn-buy:hover, .btn-cart:hover { opacity: 0.9; }
      `}</style>

      <Row className="align-items-start g-5">
        {/* ---------- LEFT: Image + Buttons ---------- */}
        <Col md={6} className="text-center">
          <Image
            src={product.image}
            alt={product.name}
            fluid
            rounded
            className="shadow-sm mb-3 hover-scale"
            style={{ maxHeight: "400px", objectFit: "contain" }}
          />

          {/* Additional Images */}
          {product.images && product.images.length > 0 && (
            <Row className="g-2 justify-content-center mb-3">
              {product.images.map((img, i) => (
                <Col xs={3} key={i}>
                  <Image
                    src={img}
                    alt={`thumb-${i}`}
                    thumbnail
                    className="hover-scale"
                    style={{
                      cursor: "pointer",
                      height: "70px",
                      objectFit: "cover",
                    }}
                  />
                </Col>
              ))}
            </Row>
          )}

          {/* 🟢 Buttons moved here under the image */}
          <div className="d-flex justify-content-center gap-3 mt-3">
            <Button size="lg" className="btn-cart px-4">
              🛒 Thêm vào giỏ
            </Button>
            <Link to="/checkout">
              <Button size="lg" className="btn-buy px-4">
                Mua ngay
              </Button>
            </Link>
          </div>
        </Col>

        {/* ---------- RIGHT: Product Info ---------- */}
        <Col md={6}>
          <h2 className="fw-bold mb-3">{product.name}</h2>

          <div className="mb-2">
            {product.category && (
              <Badge bg="success" className="me-2">
                {product.category.name}
              </Badge>
            )}
            {product.brand && <Badge bg="secondary">{product.brand}</Badge>}
          </div>

          <p className="price-text">
            {product.price.toLocaleString("vi-VN")} ₫{" "}
            {product.originalPrice && (
              <small className="text-muted text-decoration-line-through">
                {product.originalPrice.toLocaleString("vi-VN")} ₫
              </small>
            )}
          </p>

          <p className="mb-2">
            ⭐ {product.rating?.toFixed(1) || "0.0"} ({product.reviewCount} đánh giá)
          </p>

          <p className="text-muted">
            Tình trạng:{" "}
            {product.stock && product.stock > 0 ? (
              <span className="text-success">Còn hàng</span>
            ) : (
              <span className="text-danger">Hết hàng</span>
            )}
          </p>

          {/* Optional weight selection */}
          {product.weights && product.weights.length > 0 && (
            <Form.Group className="mt-3">
              <Form.Label className="fw-bold">Chọn khối lượng:</Form.Label>
              <Form.Select>
                {product.weights.map((w, i) => (
                  <option key={i}>
                    {w.value} - {w.price.toLocaleString("vi-VN")} ₫
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          {/* Promotions */}
          {product.promotions && product.promotions.length > 0 && (
            <div className="mt-4">
              <h6 className="fw-bold text-success mb-2">🎁 Khuyến mãi:</h6>
              <ul className="mb-0">
                {product.promotions.map((promo, i) => (
                  <li key={i}>{promo}</li>
                ))}
              </ul>
            </div>
          )}
        </Col>
      </Row>

      {/* ---------- Product Description ---------- */}
      <Row className="mt-5">
        <Col md={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="fw-bold mb-3">📋 Mô tả sản phẩm</h5>
              <p style={{ whiteSpace: "pre-line" }}>
                {product.description || "Không có mô tả chi tiết cho sản phẩm này."}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ---------- Related Products ---------- */}
      {related.length > 0 && (
        <Row className="mt-5">
          <Col md={12}>
            <h5 className="fw-bold mb-3">🧺 Có thể bạn sẽ thích</h5>
            <Row xs={1} md={2} lg={4} className="g-4">
              {related.map((item, idx) => (
                <Col key={item.id || idx}>
                  <Link
                    to={`/product/${item.slug}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <ProductCard product={item} />
                  </Link>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ProductDetailPage;
