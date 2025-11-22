import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '@/services/categories.service';
import { Category, CreateCategoryInput } from '@/types/api';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook to fetch all categories
 */
export const useCategories = (params?: { flat?: boolean; status?: 'active' | 'inactive' }) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => categoriesService.getCategories(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single category by ID
 */
export const useCategory = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => categoriesService.getCategoryById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch a category by slug
 */
export const useCategoryBySlug = (slug: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['categories', 'slug', slug],
    queryFn: () => categoriesService.getCategoryBySlug(slug),
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to create a new category
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCategoryInput) =>
      categoriesService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to create category',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to update an existing category
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCategoryInput> }) =>
      categoriesService.updateCategory(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to update category',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to delete a category
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => categoriesService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to delete category',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to get category products
 */
export const useCategoryProducts = (
  categoryId: string,
  params?: { page?: number; limit?: number },
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['categories', categoryId, 'products', params],
    queryFn: () => categoriesService.getCategoryProducts(categoryId, params),
    enabled: enabled && !!categoryId,
    staleTime: 2 * 60 * 1000,
  });
};

