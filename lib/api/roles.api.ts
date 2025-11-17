import { api } from '../api-client';
import type { Role, CreateRoleData, User } from '../types';

export const rolesApi = {
  // Get all roles
  getRoles: async () => {
    return api.get<Role[]>('/roles');
  },

  // Get role by ID
  getRole: async (id: string) => {
    return api.get<Role>(`/roles/${id}`);
  },

  // Get users by role
  getRoleUsers: async (id: string) => {
    return api.get<User[]>(`/roles/${id}/users`);
  },

  // Create role
  createRole: async (data: CreateRoleData) => {
    return api.post<Role>('/roles', data);
  },

  // Assign role to user
  assignRole: async (data: { userId: string; roleId: string }) => {
    return api.post('/roles/assign', data);
  },

  // Update role
  updateRole: async (id: string, data: Partial<CreateRoleData>) => {
    return api.put<Role>(`/roles/${id}`, data);
  },

  // Delete role
  deleteRole: async (id: string) => {
    return api.delete(`/roles/${id}`);
  },
};

