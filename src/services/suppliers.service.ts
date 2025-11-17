import apiClient from '@/lib/api-client';
import { ApiResponse, Supplier, PaginationParams, PurchaseHistory } from '@/types/api';

export const suppliersService = {
  // Get all suppliers
  getSuppliers: async (params?: PaginationParams & {
    search?: string;
    status?: string;
  }): Promise<ApiResponse<Supplier[]>> => {
    const response = await apiClient.get<ApiResponse<Supplier[]>>('/suppliers', { params });
    return response.data;
  },

  // Get supplier by ID
  getSupplier: async (id: string): Promise<Supplier> => {
    const response = await apiClient.get<ApiResponse<Supplier>>(`/suppliers/${id}`);
    return response.data.data!;
  },

  // Create supplier
  createSupplier: async (data: Partial<Supplier>): Promise<Supplier> => {
    const response = await apiClient.post<ApiResponse<Supplier>>('/suppliers', data);
    return response.data.data!;
  },

  // Update supplier
  updateSupplier: async (id: string, data: Partial<Supplier>): Promise<Supplier> => {
    const response = await apiClient.put<ApiResponse<Supplier>>(`/suppliers/${id}`, data);
    return response.data.data!;
  },

  // Delete supplier
  deleteSupplier: async (id: string): Promise<void> => {
    await apiClient.delete(`/suppliers/${id}`);
  },

  // Add purchase history
  addPurchaseHistory: async (id: string, data: Partial<PurchaseHistory>): Promise<Supplier> => {
    const response = await apiClient.post<ApiResponse<Supplier>>(`/suppliers/${id}/purchases`, data);
    return response.data.data!;
  },

  // Get supplier purchases
  getSupplierPurchases: async (id: string): Promise<PurchaseHistory[]> => {
    const response = await apiClient.get<ApiResponse<PurchaseHistory[]>>(`/suppliers/${id}/purchases`);
    return response.data.data!;
  },
};

