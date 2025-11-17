import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { QUERY_KEYS, STORAGE_KEYS } from '../config';
import type { LoginCredentials, RegisterData } from '../types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useCurrentUser() {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH_USER,
    queryFn: () => authApi.getCurrentUser(),
    retry: false,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH_USER });
      toast.success('Logged in successfully');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed');
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH_USER });
      toast.success('Registered successfully');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Registration failed');
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push('/auth/login');
    },
    onError: () => {
      // Still clear local data even if API call fails
      queryClient.clear();
      router.push('/auth/login');
    },
  });
}

