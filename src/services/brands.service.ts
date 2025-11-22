import apiClient from '@/lib/api-client';
import {
  ApiResponse,
  Brand,
  CreateBrandInput,
  UpdateBrandInput,
} from '@/types/api';

/**
 * Brands Service - API integration for Brand operations
 */
export const brandsService = {
  /**
   * Get all brands
   * @param params - Query parameters
   * @returns Promise with brands list
   */
  getBrands: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'active' | 'inactive';
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Promise<ApiResponse<Brand[]>> => {
    const response = await apiClient.get<ApiResponse<Brand[]>>('/brands', {
      params,
    });
    return response.data;
  },

  /**
   * Get brand by ID
   * @param id - Brand ID
   * @returns Promise with brand details
   */
  getBrandById: async (id: string): Promise<Brand> => {
    const response = await apiClient.get<ApiResponse<Brand>>(`/brands/${id}`);
    return response.data.data!;
  },

  /**
   * Create a new brand
   * @param data - Brand data
   * @returns Promise with created brand
   */
  createBrand: async (data: CreateBrandInput): Promise<Brand> => {
    const response = await apiClient.post<ApiResponse<Brand>>('/brands', data);
    return response.data.data!;
  },

  /**
   * Update an existing brand
   * @param id - Brand ID
   * @param data - Partial brand data to update
   * @returns Promise with updated brand
   */
  updateBrand: async (id: string, data: UpdateBrandInput): Promise<Brand> => {
    const response = await apiClient.put<ApiResponse<Brand>>(
      `/brands/${id}`,
      data
    );
    return response.data.data!;
  },

  /**
   * Delete a brand
   * @param id - Brand ID
   * @returns Promise<void>
   */
  deleteBrand: async (id: string): Promise<void> => {
    await apiClient.delete(`/brands/${id}`);
  },
};

