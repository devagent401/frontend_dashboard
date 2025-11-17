import apiClient from '@/lib/api-client';
import { ApiResponse, Category, CreateCategoryInput, Product, PaginationParams } from '@/types/api';

export const categoriesService = {
  // Get all categories (tree structure or flat)
  getCategories: async (flat?: boolean, status?: string): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories', {
      params: { flat, status },
    });
    return response.data.data!;
  },

  // Get category by ID
  getCategory: async (id: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data.data!;
  },

  // Get category by slug
  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/slug/${slug}`);
    return response.data.data!;
  },

  // Create category
  createCategory: async (data: CreateCategoryInput): Promise<Category> => {
    const response = await apiClient.post<ApiResponse<Category>>('/categories', data);
    return response.data.data!;
  },

  // Update category
  updateCategory: async (id: string, data: Partial<CreateCategoryInput>): Promise<Category> => {
    const response = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data.data!;
  },

  // Delete category
  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },

  // Get category products
  getCategoryProducts: async (id: string, params?: PaginationParams): Promise<ApiResponse<Product[]>> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(`/categories/${id}/products`, { params });
    return response.data;
  },
};

