import apiClient from './apiClient';
import { API_ENDPOINTS } from './config';
import { Product } from './productService';

export interface OrderItem {
  id?: number;
  product: Product | { id: number };
  quantity: number;
  selectedWeight?: string;
  price: number;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  city: string;
}

export interface Order {
  id?: number;
  user?: any;
  items: OrderItem[];
  total?: number;
  shippingFee: number;
  discount?: number;
  finalTotal?: number;
  status?: 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
  shippingAddress: ShippingAddress;
  paymentMethod: 'COD' | 'QR' | 'EWALLET';
  deliveryOption: 'EXPRESS_2H' | 'SAME_DAY' | 'SCHEDULED';
  note?: string;
  estimatedDelivery?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
}

export interface OrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}

export const orderService = {
  // Create order
  createOrder: async (order: any): Promise<OrderResponse> => {
    return apiClient.post(API_ENDPOINTS.ORDERS, order);
  },

  // Get user orders
  getUserOrders: async (userId: number, page = 0, size = 10): Promise<OrdersResponse> => {
    return apiClient.get(`${API_ENDPOINTS.USER_ORDERS(userId)}?page=${page}&size=${size}`);
  },

  // Get order by ID
  getOrderById: async (id: number): Promise<OrderResponse> => {
    return apiClient.get(API_ENDPOINTS.ORDER_BY_ID(id));
  },

  // Update order status
  updateOrderStatus: async (
    id: number,
    status: Order['status']
  ): Promise<OrderResponse> => {
    return apiClient.patch(`${API_ENDPOINTS.UPDATE_ORDER_STATUS(id)}?status=${status}`);
  },

  // Cancel order
  cancelOrder: async (id: number): Promise<OrderResponse> => {
    return apiClient.post(API_ENDPOINTS.CANCEL_ORDER(id));
  },

  // Get order statistics (admin)
  getOrderStats: async (): Promise<{
    success: boolean;
    data: {
      pending: number;
      confirmed: number;
      shipping: number;
      delivered: number;
      cancelled: number;
    };
  }> => {
    return apiClient.get(API_ENDPOINTS.ORDER_STATS);
  },
};

