import apiClient from '@/lib/api-client';
import {
  ApiResponse,
  Product,
  CreateProductInput,
  PaginationParams,
} from '@/types/api';

export const productsService = {
  // Get all products
  getProducts: async (params?: PaginationParams & {
    search?: string;
    categoryId?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Promise<ApiResponse<Product[]>> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products', { params });
    return response.data;
  },

  // Get product by ID
  getProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data!;
  },

  // Get product by barcode
  getProductByBarcode: async (barcode: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/barcode/${barcode}`);
    return response.data.data!;
  },

  // Create product
  createProduct: async (data: CreateProductInput): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>('/products', data);
    return response.data.data!;
  },

  // Update product
  updateProduct: async (id: string, data: Partial<CreateProductInput>): Promise<Product> => {
    const response = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data.data!;
  },

  // Delete product
  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  // Update stock
  updateStock: async (id: string, stockQuantity: number, damagedQuantity?: number): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(`/products/${id}/stock`, {
      stockQuantity,
      damagedQuantity,
    });
    return response.data.data!;
  },

  // Get low stock products
  getLowStockProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products/stock/low');
    return response.data.data!;
  },
};

