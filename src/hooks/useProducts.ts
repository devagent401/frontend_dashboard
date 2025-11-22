import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';
import {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductQueryParams,
  StockAdjustment,
} from '@/types/api';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook to fetch all products with filtering and pagination
 */
export const useProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsService.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single product by ID
 */
export const useProduct = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsService.getProductById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch a product by slug
 */
export const useProductBySlug = (slug: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['products', 'slug', slug],
    queryFn: () => productsService.getProductBySlug(slug),
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch a product by barcode
 */
export const useProductByBarcode = (
  barcode: string,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ['products', 'barcode', barcode],
    queryFn: () => productsService.getProductByBarcode(barcode),
    enabled: enabled && !!barcode,
    staleTime: 0, // Don't cache barcode lookups
  });
};

/**
 * Hook to fetch low stock products
 */
export const useLowStockProducts = () => {
  return useQuery({
    queryKey: ['products', 'low-stock'],
    queryFn: () => productsService.getLowStockProducts(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to create a new product
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateProductInput) =>
      productsService.createProduct(data),
    onSuccess: (data) => {
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Success',
        description: 'Product created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to create product',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to update an existing product
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductInput }) =>
      productsService.updateProduct(id, data),
    onSuccess: (data, variables) => {
      // Invalidate specific product and products list
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to update product',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to delete a product
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => productsService.deleteProduct(id),
    onSuccess: () => {
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to delete product',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to adjust product stock
 */
export const useAdjustStock = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, adjustment }: { id: string; adjustment: StockAdjustment }) =>
      productsService.adjustStock(id, adjustment),
    onSuccess: (data, variables) => {
      // Invalidate specific product and products list
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', 'low-stock'] });
      toast({
        title: 'Success',
        description: 'Stock adjusted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to adjust stock',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Combined hook for product operations
 * Provides all CRUD operations and queries in one hook
 */
export const useProductOperations = (id?: string) => {
  const products = useProducts();
  const product = useProduct(id || '', !!id);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const adjustStock = useAdjustStock();
  const lowStockProducts = useLowStockProducts();

  return {
    // Queries
    products,
    product,
    lowStockProducts,

    // Mutations
    createProduct,
    updateProduct,
    deleteProduct,
    adjustStock,

    // Helpers
    isLoading:
      products.isLoading ||
      product.isLoading ||
      createProduct.isPending ||
      updateProduct.isPending ||
      deleteProduct.isPending ||
      adjustStock.isPending,
  };
};

