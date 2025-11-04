import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Badge, Form, InputGroup, Button, Dropdown, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { categoryService, Category } from '../api/categoryService';

const Header: React.FC = () => {
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Giả sử check từ localStorage/context
  const [userRole, setUserRole] = useState<'customer' | 'admin'>('customer'); // Phân quyền
  const [userName, setUserName] = useState('Nguyễn Văn A');
  const [wishlistCount] = useState(5); // Số lượng wishlist

  useEffect(() => {
    loadCategories();
    // Check login status
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole') as 'customer' | 'admin' || 'customer';
    const name = localStorage.getItem('userName') || 'User';
    
    setIsLoggedIn(!!token);
    setUserRole(role);
    setUserName(name);
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    navigate('/login');
  };

  // NAVBAR CHO ADMIN/STAFF
  if (userRole === 'admin') {
    return (
      <>
        <Navbar 
          style={{ backgroundColor: '#23854D', transition: 'all 0.3s ease' }}
          variant="dark" 
          expand="lg" 
          sticky="top" 
          className="shadow-lg"
        >
          <Container fluid className="px-4">
            <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 d-flex align-items-center">
              <span className="d-inline-block" style={{ animation: 'pulse 2s infinite' }}>🛒</span> 
              <span className="ms-2">FreshMart Admin</span>
            </Navbar.Brand>
            
            <Navbar.Toggle aria-controls="admin-navbar-nav" />
            
            <Navbar.Collapse id="admin-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/admin" className="fw-semibold px-3" style={{ color: '#FFD34C' }}>
                  🛠️ Quản lý sản phẩm
                </Nav.Link>
                <Nav.Link as={Link} to="/inventory" className="fw-semibold px-3" style={{ color: '#FFD34C' }}>
                  📦 Tồn kho
                </Nav.Link>
                <Nav.Link as={Link} to="/orders" className="fw-semibold px-3" style={{ color: '#FFD34C' }}>
                  📋 Đơn hàng
                </Nav.Link>
                <Nav.Link as={Link} to="/dashboard" className="fw-semibold px-3" style={{ color: '#FFD34C' }}>
                  📊 Dashboard
                </Nav.Link>
              </Nav>

              <Nav className="ms-auto d-flex align-items-center">
                <Nav.Link className="position-relative me-3">
                  <span style={{ fontSize: '1.5rem' }}>🔔</span>
                  <Badge 
                    bg="danger" 
                    pill 
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: '0.65rem' }}
                  >
                    3
                  </Badge>
                </Nav.Link>

                <NavDropdown 
                  title={<><span>👤</span> <span className="fw-semibold">Tài khoản</span></>} 
                  id="admin-dropdown"
                  align="end"
                >
                  <Dropdown.Item as={Link} to="/profile">👤 Hồ sơ</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/settings">⚙️ Cài đặt</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">🚪 Đăng xuất</Dropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>
    );
  }

  // NAVBAR CHO NGƯỜI MUA HÀNG (CUSTOMER)
  return (
    <>
      <Navbar 
        style={{ backgroundColor: '#23854D', transition: 'all 0.3s ease' }}
        variant="dark" 
        expand="lg" 
        sticky="top" 
        className="shadow-lg"
      >
        <Container fluid className="px-4">
          {/* LEFT: Logo */}
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 me-3">
            <span className="d-inline-block" style={{ animation: 'pulse 2s infinite' }}>🛒</span> FreshMart
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="customer-navbar-nav" />
          
          <Navbar.Collapse id="customer-navbar-nav">
            {/* CENTER: Search Bar */}
            <Form 
              className="mx-auto my-2 my-lg-0" 
              style={{ maxWidth: '600px', width: '100%', transition: 'all 0.3s ease' }} 
              onSubmit={handleSearch}
            >
              <InputGroup>
                <Form.Control
                  type="search"
                  placeholder="Tìm kiếm sản phẩm, danh mục..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ borderRadius: '25px 0 0 25px' }}
                />
                <Button 
                  variant="warning" 
                  type="submit"
                  style={{ borderRadius: '0 25px 25px 0', color: '#23854D', fontWeight: 'bold' }}
                >
                  🔍 Tìm
                </Button>
              </InputGroup>
            </Form>

            {/* RIGHT: Menu Items */}
            <Nav className="ms-auto d-flex align-items-center">
              <Nav.Link as={Link} to="/" className="fw-semibold px-3 nav-hover">
                🏠 Trang chủ
              </Nav.Link>
              <Nav.Link as={Link} to="/products" className="fw-semibold px-3 nav-hover">
                📦 Sản phẩm
              </Nav.Link>
              <Nav.Link as={Link} to="/admin" className="fw-semibold px-3 nav-hover" style={{ color: '#FFD34C' }}>
                🛠️ Quản lý sản phẩm
              </Nav.Link>
              <Nav.Link as={Link} to="/inventory" className="fw-semibold px-3 nav-hover" style={{ color: '#90CDF4' }}>
                📦 Tồn kho
              </Nav.Link>
              <Nav.Link as={Link} to="/refund-request" className="fw-semibold px-3 nav-hover" style={{ color: '#FF6B6B' }}>
                🔄 Yêu cầu hoàn trả
              </Nav.Link>

              <Nav.Link as={Link} to="/wishlist" className="position-relative px-3 nav-hover">
                <span style={{ fontSize: '1.3rem' }}>❤️</span>
                {wishlistCount > 0 && (
                  <Badge 
                    bg="danger" 
                    pill 
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: '0.65rem' }}
                  >
                    {wishlistCount}
                  </Badge>
                )}
              </Nav.Link>

              <Nav.Link as={Link} to="/cart" className="position-relative px-3 nav-hover">
                <span style={{ fontSize: '1.3rem' }}>🛒</span>
                {getTotalItems() > 0 && (
                  <Badge 
                    bg="danger" 
                    pill 
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ animation: 'pulse 1.5s infinite', fontSize: '0.7rem' }}
                  >
                    {getTotalItems()}
                  </Badge>
                )}
              </Nav.Link>

              {isLoggedIn ? (
                <NavDropdown 
                  title={<><span>👤</span> <span className="fw-semibold">Tài khoản</span></>} 
                  id="user-dropdown"
                  align="end"
                  className="nav-hover"
                >
                  <Dropdown.Item as={Link} to="/profile">👤 Hồ sơ của tôi</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/orders">📦 Đơn hàng</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/wishlist">❤️ Danh sách yêu thích</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">🚪 Đăng xuất</Dropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/login" className="fw-semibold px-3 nav-hover">
                  <Button variant="warning" size="sm" style={{ fontWeight: 'bold', color: '#23854D' }}>
                    👤 Đăng nhập
                  </Button>
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="mobile-bottom-nav d-lg-none">
        <Link to="/" className="mobile-nav-item">
          <span>🏠</span>
          <small>Home</small>
        </Link>
        <Link to="/products" className="mobile-nav-item">
          <span>📂</span>
          <small>Danh mục</small>
        </Link>
        <Link to="/cart" className="mobile-nav-item position-relative">
          <span>🛒</span>
          {getTotalItems() > 0 && (
            <Badge 
              bg="danger" 
              pill 
              className="position-absolute"
              style={{ top: '-5px', right: '15px', fontSize: '0.6rem' }}
            >
              {getTotalItems()}
            </Badge>
          )}
          <small>Cart</small>
        </Link>
        <Link to="/search" className="mobile-nav-item">
          <span>🔍</span>
          <small>Tìm kiếm</small>
        </Link>
        <Link to={isLoggedIn ? "/profile" : "/login"} className="mobile-nav-item">
          <span>👤</span>
          <small>User</small>
        </Link>
      </div>
    </>
  );
};

export default Header;

