import apiClient from '@/lib/api-client';
import { ApiResponse, Role, User } from '@/types/api';

export const rolesService = {
  // Get all roles
  getRoles: async (status?: string): Promise<Role[]> => {
    const response = await apiClient.get<ApiResponse<Role[]>>('/roles', {
      params: { status },
    });
    return response.data.data!;
  },

  // Get role by ID
  getRole: async (id: string): Promise<Role> => {
    const response = await apiClient.get<ApiResponse<Role>>(`/roles/${id}`);
    return response.data.data!;
  },

  // Create role
  createRole: async (data: { name: string; description?: string; permissions: string[] }): Promise<Role> => {
    const response = await apiClient.post<ApiResponse<Role>>('/roles', data);
    return response.data.data!;
  },

  // Update role
  updateRole: async (id: string, data: Partial<Role>): Promise<Role> => {
    const response = await apiClient.put<ApiResponse<Role>>(`/roles/${id}`, data);
    return response.data.data!;
  },

  // Delete role
  deleteRole: async (id: string): Promise<void> => {
    await apiClient.delete(`/roles/${id}`);
  },

  // Assign role to user
  assignRole: async (userId: string, roleId: string): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>('/roles/assign', {
      userId,
      roleId,
    });
    return response.data.data!;
  },

  // Get users by role
  getUsersByRole: async (roleId: string): Promise<User[]> => {
    const response = await apiClient.get<ApiResponse<User[]>>(`/roles/${roleId}/users`);
    return response.data.data!;
  },
};

