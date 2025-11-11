import apiClient from './apiClient';
import { API_ENDPOINTS } from './config';
import { SupplierOrder } from '../types';

export interface SupplierOrderListResponse {
  success: boolean;
  data: SupplierOrder[];
}

export interface CreateSupplierOrderPayload {
  orderDate: string;
  expectedDeliveryDate?: string | null;
  supplierId: number;
  notes?: string;
  items: Array<{
    productId: number;
    quantity: number;
    unitPrice: number;
  }>;
}

export interface CreateSupplierOrderResponse {
  success: boolean;
  data: SupplierOrder;
  message?: string;
}

export const supplierOrderService = {
  getOrders: async (): Promise<SupplierOrderListResponse> => {
    return apiClient.get(API_ENDPOINTS.SUPPLIER_ORDERS);
  },

  createOrder: async (payload: CreateSupplierOrderPayload): Promise<CreateSupplierOrderResponse> => {
    return apiClient.post(API_ENDPOINTS.SUPPLIER_ORDERS, payload);
  },
};
