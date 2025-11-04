import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implement actual authentication logic
      // For now, simple demo
      if (formData.username && formData.password) {
        // Store user info (in real app, use proper authentication)
        localStorage.setItem('token', 'demo-token-' + Date.now());
        localStorage.setItem('userName', formData.username);
        
        // Redirect based on role
        if (formData.username.toLowerCase() === 'admin') {
          localStorage.setItem('userRole', 'admin');
          navigate('/admin');
        } else {
          localStorage.setItem('userRole', 'customer');
          navigate('/');
        }
        
        // Reload để cập nhật navbar
        window.location.reload();
      } else {
        setError('Vui lòng nhập tên đăng nhập và mật khẩu');
      }
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-center min-vh-100" 
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}
    >
      <Container style={{ maxWidth: '450px' }}>
        <Card className="shadow-lg border-0" style={{ borderRadius: '15px' }}>
          <Card.Body className="p-5">
            <div className="text-center mb-4 fade-in">
              <h2 className="fw-bold mb-2" style={{ fontSize: '2rem', color: '#333' }}>
                Chào mừng trở lại
              </h2>
              <p className="text-muted" style={{ fontSize: '0.95rem' }}>
                Vui lòng đăng nhập vào tài khoản của bạn.
              </p>
            </div>

            {error && (
              <Alert variant="danger" dismissible onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="text-muted small fw-semibold">Tài khoản</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Nhập tên đăng nhập hoặc email"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  style={{
                    padding: '12px 15px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="text-muted small fw-semibold">Mật khẩu</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    style={{
                      padding: '12px 45px 12px 15px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '0.95rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '5px',
                      color: '#999'
                    }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </Form.Group>

              <div className="text-end mb-4">
                <Link 
                  to="/forgot-password" 
                  style={{ 
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    color: '#5B9EFE'
                  }}
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-100 fw-semibold"
                style={{
                  padding: '12px',
                  fontSize: '1rem',
                  borderRadius: '8px',
                  background: '#5B9EFE',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(91, 158, 254, 0.3)'
                }}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </Form>

            <div className="text-center mt-4">
              <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                Chưa có tài khoản?{' '}
              </span>
              <Link 
                to="/signup" 
                style={{ 
                  textDecoration: 'none',
                  fontWeight: '600',
                  color: '#5B9EFE'
                }}
              >
                Đăng ký ngay
              </Link>
            </div>
          </Card.Body>
        </Card>

        <div className="text-center mt-3">
          <Link 
            to="/" 
            className="text-white text-decoration-none"
            style={{ fontSize: '0.9rem' }}
          >
            ← Về trang chủ
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;

