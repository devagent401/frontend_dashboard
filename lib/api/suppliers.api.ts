import { api } from '../api-client';
import type { Supplier, CreateSupplierData, PaginationParams, PurchaseHistory } from '../types';

export const suppliersApi = {
  // Get all suppliers
  getSuppliers: async (params?: PaginationParams & { status?: string; search?: string }) => {
    return api.get<Supplier[]>('/suppliers', params);
  },

  // Get supplier by ID
  getSupplier: async (id: string) => {
    return api.get<Supplier>(`/suppliers/${id}`);
  },

  // Get supplier purchases
  getSupplierPurchases: async (id: string) => {
    return api.get<PurchaseHistory[]>(`/suppliers/${id}/purchases`);
  },

  // Create supplier
  createSupplier: async (data: CreateSupplierData) => {
    return api.post<Supplier>('/suppliers', data);
  },

  // Add purchase history
  addPurchaseHistory: async (id: string, data: Omit<PurchaseHistory, 'totalAmount'>) => {
    return api.post<Supplier>(`/suppliers/${id}/purchases`, data);
  },

  // Update supplier
  updateSupplier: async (id: string, data: Partial<CreateSupplierData>) => {
    return api.put<Supplier>(`/suppliers/${id}`, data);
  },

  // Delete supplier
  deleteSupplier: async (id: string) => {
    return api.delete(`/suppliers/${id}`);
  },
};

