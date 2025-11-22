import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandsService } from '@/services/brands.service';
import { Brand, CreateBrandInput, UpdateBrandInput } from '@/types/api';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook to fetch all brands
 */
export const useBrands = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive';
  sortBy?: string;
  order?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['brands', params],
    queryFn: () => brandsService.getBrands(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single brand by ID
 */
export const useBrand = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['brands', id],
    queryFn: () => brandsService.getBrandById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to create a new brand
 */
export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateBrandInput) => brandsService.createBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast({
        title: 'Success',
        description: 'Brand created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create brand',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to update an existing brand
 */
export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBrandInput }) =>
      brandsService.updateBrand(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      queryClient.invalidateQueries({ queryKey: ['brands', variables.id] });
      toast({
        title: 'Success',
        description: 'Brand updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update brand',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to delete a brand
 */
export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => brandsService.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast({
        title: 'Success',
        description: 'Brand deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete brand',
        variant: 'destructive',
      });
    },
  });
};

