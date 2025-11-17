import { api } from '../api-client';
import { STORAGE_KEYS } from '../config';
import type { AuthResponse, LoginCredentials, RegisterData, User } from '../types';

export const authApi = {
  // Register
  register: async (data: RegisterData) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.success && response.data) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    }
    return response;
  },

  // Login
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.success && response.data) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    }
    return response;
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  // Get current user
  getCurrentUser: async () => {
    return api.get<User>('/auth/me');
  },

  // Refresh token
  refreshToken: async (refreshToken: string) => {
    return api.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      refreshToken,
    });
  },
};

