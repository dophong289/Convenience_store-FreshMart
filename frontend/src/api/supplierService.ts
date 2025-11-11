import apiClient from './apiClient';
import { API_ENDPOINTS } from './config';
import { Supplier } from '../types';

export interface SuppliersResponse {
  success: boolean;
  data: Supplier[];
}

export interface SupplierResponse {
  success: boolean;
  data: Supplier;
  message?: string;
}

export interface CreateSupplierPayload {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const supplierService = {
  getSuppliers: async (): Promise<SuppliersResponse> => {
    return apiClient.get(API_ENDPOINTS.SUPPLIERS);
  },

  createSupplier: async (payload: CreateSupplierPayload): Promise<SupplierResponse> => {
    return apiClient.post(API_ENDPOINTS.SUPPLIERS, payload);
  },
};
