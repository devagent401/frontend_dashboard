import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '../api/roles.api';
import { QUERY_KEYS } from '../config';
import type { CreateRoleData } from '../types';
import { toast } from 'sonner';

export function useRoles() {
  return useQuery({
    queryKey: QUERY_KEYS.ROLES,
    queryFn: () => rolesApi.getRoles(),
  });
}

export function useRole(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ROLE(id),
    queryFn: () => rolesApi.getRole(id),
    enabled: !!id,
  });
}

export function useRoleUsers(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ROLE_USERS(id),
    queryFn: () => rolesApi.getRoleUsers(id),
    enabled: !!id,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateRoleData) => rolesApi.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES });
      toast.success('Role created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create role');
    },
  });
}

export function useAssignRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { userId: string; roleId: string }) => rolesApi.assignRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES });
      toast.success('Role assigned successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to assign role');
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateRoleData> }) =>
      rolesApi.updateRole(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLE(variables.id) });
      toast.success('Role updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update role');
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => rolesApi.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES });
      toast.success('Role deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete role');
    },
  });
}

