import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../api/categories.api';
import { QUERY_KEYS } from '../config';
import type { CreateCategoryData, PaginationParams } from '../types';
import { toast } from 'sonner';

export function useCategories(params?: { flat?: boolean; status?: string }) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CATEGORIES, params],
    queryFn: () => categoriesApi.getCategories(params),
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORY(id),
    queryFn: () => categoriesApi.getCategory(id),
    enabled: !!id,
  });
}

export function useCategoryProducts(id: string, params?: PaginationParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CATEGORY_PRODUCTS(id), params],
    queryFn: () => categoriesApi.getCategoryProducts(id, params),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCategoryData) => categoriesApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
      toast.success('Category created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create category');
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCategoryData> }) =>
      categoriesApi.updateCategory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORY(variables.id) });
      toast.success('Category updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update category');
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => categoriesApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
      toast.success('Category deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete category');
    },
  });
}

