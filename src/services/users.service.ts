import apiClient from '@/lib/api-client';
import { ApiResponse, User, PaginationParams } from '@/types/api';

export const usersService = {
  // Get all users
  getUsers: async (params?: PaginationParams & {
    search?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<User[]>> => {
    const response = await apiClient.get<ApiResponse<User[]>>('/users', { params });
    return response.data;
  },

  // Get user by ID
  getUser: async (id: string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data!;
  },

  // Update user
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data!;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  // Toggle user status
  toggleUserStatus: async (id: string): Promise<User> => {
    const response = await apiClient.patch<ApiResponse<User>>(`/users/${id}/toggle-status`);
    return response.data.data!;
  },

  // Get user statistics
  getUserStats: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponse>('/users/stats');
    return response.data.data!;
  },
};

