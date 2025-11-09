// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_SLUG: (slug: string) => `/products/${slug}`,
  PRODUCT_MANAGE_BY_ID: (id: number) => `/products/manage/${id}`,
  PRODUCT_UPDATE: (id: number) => `/products/${id}`,
  PRODUCTS_BY_CATEGORY: (slug: string) => `/products/category/${slug}`,
  FLASH_SALE_PRODUCTS: '/products/flash-sale',
  BEST_SELLING_PRODUCTS: '/products/best-selling',
  PRODUCT_ORIGINS: '/products/filters/origins',
  PRODUCT_BRANDS: '/products/filters/brands',
  
  // Categories
  CATEGORIES: '/categories',
  CATEGORY_BY_SLUG: (slug: string) => `/categories/${slug}`,
  
  // Orders
  ORDERS: '/orders',
  ORDER_BY_ID: (id: number) => `/orders/${id}`,
  USER_ORDERS: (userId: number) => `/orders/user/${userId}`,
  ORDER_STATUS: (status: string) => `/orders/status/${status}`,
  UPDATE_ORDER_STATUS: (id: number) => `/orders/${id}/status`,
  CANCEL_ORDER: (id: number) => `/orders/${id}/cancel`,
  ORDER_STATS: '/orders/stats/count',
  
  // Users
  USERS: '/users',
  USER_BY_ID: (id: number) => `/users/${id}`,
  ADD_TO_WISHLIST: (userId: number, productId: number) => `/users/${userId}/wishlist/${productId}`,
  REMOVE_FROM_WISHLIST: (userId: number, productId: number) => `/users/${userId}/wishlist/${productId}`,
};

