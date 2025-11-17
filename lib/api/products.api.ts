import { api } from '../api-client';
import type { Product, CreateProductData, ProductQueryParams } from '../types';

export const productsApi = {
  // Get all products
  getProducts: async (params?: ProductQueryParams) => {
    return api.get<Product[]>('/products', params);
  },

  // Get product by ID
  getProduct: async (id: string) => {
    return api.get<Product>(`/products/${id}`);
  },

  // Get product by barcode
  getProductByBarcode: async (barcode: string) => {
    return api.get<Partial<Product>>(`/products/barcode/${barcode}`);
  },

  // Get low stock products
  getLowStockProducts: async () => {
    return api.get<Product[]>('/products/stock/low');
  },

  // Create product
  createProduct: async (data: CreateProductData) => {
    return api.post<Product>('/products', data);
  },

  // Update product
  updateProduct: async (id: string, data: Partial<CreateProductData>) => {
    return api.put<Product>(`/products/${id}`, data);
  },

  // Update stock
  updateStock: async (id: string, data: { stockQuantity?: number; damagedQuantity?: number }) => {
    return api.patch<Product>(`/products/${id}/stock`, data);
  },

  // Delete product
  deleteProduct: async (id: string) => {
    return api.delete(`/products/${id}`);
  },
};

