import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import InventoryPage from './pages/InventoryPage';
import RefundRequestPage from './pages/RefundRequestPage';
import ProductEditPage from './pages/ProductEditPage';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/products/:id/edit" element={<ProductEditPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/refund-request" element={<RefundRequestPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </main>

          <footer className="bg-dark text-white py-4 mt-5">
            <Container>
              <div className="text-center">
                <h5>🛒 FreshMart</h5>
                <p className="mb-0">Thực phẩm tươi ngon mỗi ngày nha</p>
                <small className="text-muted">© 2025 FreshMart. All rights reserved.</small>
              </div>
            </Container>
          </footer>
    </div>
      </CartProvider>
    </Router>
  );
}

export default App;
