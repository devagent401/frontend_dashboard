import apiClient from '@/lib/api-client';
import {
  ApiResponse,
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductQueryParams,
  StockAdjustment,
  StockAdjustmentResponse,
} from '@/types/api';

/**
 * Products Service - Comprehensive API integration for Product operations
 * Based on API Documentation /api/v1/products endpoints
 */
export const productsService = {
  /**
   * Get all products with filtering, sorting, and pagination
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with products list and pagination metadata
   */
  getProducts: async (
    params?: ProductQueryParams
  ): Promise<ApiResponse<Product[]>> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products', {
      params,
    });
    return response.data;
  },

  /**
   * Get a single product by ID
   * @param id - Product ID
   * @returns Promise with product details
   */
  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(
      `/products/${id}`
    );
    return response.data.data!;
  },

  /**
   * Get a product by slug (for public-facing URLs)
   * @param slug - Product slug
   * @returns Promise with product details
   */
  getProductBySlug: async (slug: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(
      `/products/slug/${slug}`
    );
    return response.data.data!;
  },

  /**
   * Get a product by barcode (useful for POS systems)
   * @param barcode - Product barcode
   * @returns Promise with product details
   */
  getProductByBarcode: async (barcode: string): Promise<Partial<Product>> => {
    const response = await apiClient.get<ApiResponse<Partial<Product>>>(
      `/products/barcode/${barcode}`
    );
    return response.data.data!;
  },

  /**
   * Get products with low stock or out of stock
   * @returns Promise with low stock products
   */
  getLowStockProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      '/products/stock/low'
    );
    return response.data.data!;
  },

  /**
   * Create a new product
   * @param data - Product data
   * @returns Promise with created product
   */
  createProduct: async (data: CreateProductInput): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>(
      '/products',
      data
    );
    return response.data.data!;
  },

  /**
   * Update an existing product
   * @param id - Product ID
   * @param data - Partial product data to update
   * @returns Promise with updated product
   */
  updateProduct: async (
    id: string,
    data: UpdateProductInput
  ): Promise<Product> => {
    const response = await apiClient.put<ApiResponse<Product>>(
      `/products/${id}`,
      data
    );
    return response.data.data!;
  },

  /**
   * Delete a product (soft delete by default)
   * @param id - Product ID
   * @returns Promise<void>
   */
  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  /**
   * Adjust product stock quantity
   * @param id - Product ID
   * @param adjustment - Stock adjustment data
   * @returns Promise with adjustment result
   */
  adjustStock: async (
    id: string,
    adjustment: StockAdjustment
  ): Promise<StockAdjustmentResponse> => {
    const response = await apiClient.post<
      ApiResponse<StockAdjustmentResponse>
    >(`/products/${id}/stock`, adjustment);
    return response.data.data!;
  },
};
