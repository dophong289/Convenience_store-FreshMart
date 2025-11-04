import apiClient from './apiClient';
import { API_ENDPOINTS } from './config';

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: any;
  categorySlug: string;
  brand?: string;
  origin?: string;
  stock: number;
  sold: number;
  rating: number;
  reviewCount: number;
  isFlashSale: boolean;
  flashSaleDiscount?: number;
  flashSaleEnd?: string;
  weights?: any[];
  tags?: string[];
  ingredients?: string;
  expiry?: string;
  promotions?: string[];
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

export const productService = {
  // Get all products with filters
  getProducts: async (params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    origin?: string;
    brand?: string;
    inStock?: boolean;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    size?: number;
  }): Promise<ProductsResponse> => {
    return apiClient.get(API_ENDPOINTS.PRODUCTS, { params });
  },

  // Get product by slug
  getProductBySlug: async (slug: string): Promise<ProductResponse> => {
    return apiClient.get(API_ENDPOINTS.PRODUCT_BY_SLUG(slug));
  },

  // Get products by category
  getProductsByCategory: async (categorySlug: string): Promise<ProductsResponse> => {
    return apiClient.get(API_ENDPOINTS.PRODUCTS_BY_CATEGORY(categorySlug));
  },

  // Get flash sale products
  getFlashSaleProducts: async (): Promise<ProductsResponse> => {
    return apiClient.get(API_ENDPOINTS.FLASH_SALE_PRODUCTS);
  },

  // Get best selling products
  getBestSellingProducts: async (): Promise<ProductsResponse> => {
    return apiClient.get(API_ENDPOINTS.BEST_SELLING_PRODUCTS);
  },

  // Get all origins (for filters)
  getOrigins: async (): Promise<{ success: boolean; data: string[] }> => {
    return apiClient.get(API_ENDPOINTS.PRODUCT_ORIGINS);
  },

  // Get all brands (for filters)
  getBrands: async (): Promise<{ success: boolean; data: string[] }> => {
    return apiClient.get(API_ENDPOINTS.PRODUCT_BRANDS);
  },
};

