import { api } from '../api-client';
import type { Category, CreateCategoryData, Product, PaginationParams } from '../types';

export const categoriesApi = {
  // Get all categories
  getCategories: async (params?: { flat?: boolean; status?: string }) => {
    return api.get<Category[]>('/categories', params);
  },

  // Get category by ID
  getCategory: async (id: string) => {
    return api.get<Category>(`/categories/${id}`);
  },

  // Get category by slug
  getCategoryBySlug: async (slug: string) => {
    return api.get<Category>(`/categories/slug/${slug}`);
  },

  // Get category products
  getCategoryProducts: async (id: string, params?: PaginationParams) => {
    return api.get<Product[]>(`/categories/${id}/products`, params);
  },

  // Create category
  createCategory: async (data: CreateCategoryData) => {
    return api.post<Category>('/categories', data);
  },

  // Update category
  updateCategory: async (id: string, data: Partial<CreateCategoryData>) => {
    return api.put<Category>(`/categories/${id}`, data);
  },

  // Delete category
  deleteCategory: async (id: string) => {
    return api.delete(`/categories/${id}`);
  },
};

