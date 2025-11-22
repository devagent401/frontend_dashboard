import apiClient from '@/lib/api-client';
import {
  ApiResponse,
  Category,
  CreateCategoryInput,
} from '@/types/api';

/**
 * Categories Service - API integration for Category operations
 */
export const categoriesService = {
  /**
   * Get all categories
   * @param params - Query parameters
   * @returns Promise with categories list
   */
  getCategories: async (params?: {
    flat?: boolean;
    status?: 'active' | 'inactive';
  }): Promise<ApiResponse<Category[]>> => {
    const response = await apiClient.get<ApiResponse<Category[]>>(
      '/categories',
      { params }
    );
    return response.data;
  },

  /**
   * Get category by ID
   * @param id - Category ID
   * @returns Promise with category details
   */
  getCategoryById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(
      `/categories/${id}`
    );
    return response.data.data!;
  },

  /**
   * Get category by slug
   * @param slug - Category slug
   * @returns Promise with category details
   */
  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(
      `/categories/slug/${slug}`
    );
    return response.data.data!;
  },

  /**
   * Create a new category
   * @param data - Category data
   * @returns Promise with created category
   */
  createCategory: async (data: CreateCategoryInput): Promise<Category> => {
    const response = await apiClient.post<ApiResponse<Category>>(
      '/categories',
      data
    );
    return response.data.data!;
  },

  /**
   * Update an existing category
   * @param id - Category ID
   * @param data - Partial category data to update
   * @returns Promise with updated category
   */
  updateCategory: async (
    id: string,
    data: Partial<CreateCategoryInput>
  ): Promise<Category> => {
    const response = await apiClient.put<ApiResponse<Category>>(
      `/categories/${id}`,
      data
    );
    return response.data.data!;
  },

  /**
   * Delete a category
   * @param id - Category ID
   * @returns Promise<void>
   */
  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },

  /**
   * Get products in a category
   * @param id - Category ID
   * @param params - Query parameters
   * @returns Promise with products
   */
  getCategoryProducts: async (
    id: string,
    params?: { page?: number; limit?: number }
  ): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get<ApiResponse<any[]>>(
      `/categories/${id}/products`,
      { params }
    );
    return response.data;
  },
};
