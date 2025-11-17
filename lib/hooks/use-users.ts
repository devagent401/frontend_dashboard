import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import { QUERY_KEYS } from '../config';
import type { User, UserQueryParams } from '../types';
import { toast } from 'sonner';

export function useUsers(params?: UserQueryParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.USERS, params],
    queryFn: () => usersApi.getUsers(params),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.USER(id),
    queryFn: () => usersApi.getUser(id),
    enabled: !!id,
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: QUERY_KEYS.USER_STATS,
    queryFn: () => usersApi.getUserStats(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<User>) => usersApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH_USER });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      usersApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to change password');
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      usersApi.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER(variables.id) });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update user');
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => usersApi.toggleUserStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      toast.success('User status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to toggle user status');
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });
}

