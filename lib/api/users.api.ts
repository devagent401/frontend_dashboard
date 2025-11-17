import { api } from '../api-client';
import type { User, UserQueryParams } from '../types';

export const usersApi = {
  // Get all users
  getUsers: async (params?: UserQueryParams) => {
    return api.get<User[]>('/users', params);
  },

  // Get user stats
  getUserStats: async () => {
    return api.get('/users/stats');
  },

  // Get user by ID
  getUser: async (id: string) => {
    return api.get<User>(`/users/${id}`);
  },

  // Update profile
  updateProfile: async (data: Partial<User>) => {
    return api.put<User>('/users/profile', data);
  },

  // Change password
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    return api.post('/users/change-password', data);
  },

  // Update user (admin)
  updateUser: async (id: string, data: Partial<User>) => {
    return api.put<User>(`/users/${id}`, data);
  },

  // Toggle user status
  toggleUserStatus: async (id: string) => {
    return api.patch<User>(`/users/${id}/toggle-status`, {});
  },

  // Delete user
  deleteUser: async (id: string) => {
    return api.delete(`/users/${id}`);
  },
};

