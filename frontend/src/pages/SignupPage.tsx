import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      // TODO: Implement actual signup logic
      // For now, simple demo
      setSuccess('Account created successfully! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
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
                Create Account
              </h2>
              <p className="text-muted" style={{ fontSize: '0.95rem' }}>
                Sign up to get started.
              </p>
            </div>

            {error && (
              <Alert variant="danger" dismissible onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert variant="success">
                {success}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="text-muted small fw-semibold">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
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

              <Form.Group className="mb-3">
                <Form.Label className="text-muted small fw-semibold">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
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

              <Form.Group className="mb-3">
                <Form.Label className="text-muted small fw-semibold">Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Choose a username"
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

              <Form.Group className="mb-3">
                <Form.Label className="text-muted small fw-semibold">Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a password"
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

              <Form.Group className="mb-4">
                <Form.Label className="text-muted small fw-semibold">Confirm Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </Form.Group>

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
                {loading ? 'Creating account...' : 'Sign up'}
              </Button>
            </Form>

            <div className="text-center mt-4">
              <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                Already have an account?{' '}
              </span>
              <Link 
                to="/login" 
                style={{ 
                  textDecoration: 'none',
                  fontWeight: '600',
                  color: '#5B9EFE'
                }}
              >
                Log in
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
            ← Back to Home
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default SignupPage;

