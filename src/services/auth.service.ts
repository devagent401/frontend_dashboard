import apiClient, { setAccessToken, clearTokens, getAccessToken } from '@/lib/api-client';
import { storageAdapter } from '@/utils/storage';
import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '@/types/api';

// Utility: Decode JWT and extract user data
export const getUserFromToken = (token: string): User | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    
    // Map backend JWT payload to User type
    return {
      _id: payload.userId || payload.id || payload._id,
      name: payload.name || '',
      email: payload.email || '',
      role: payload.role || 'customer',
      permissions: payload.permissions || [],
      isActive: true,
      createdAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const authService = {
  // Login
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    const { accessToken, refreshToken, user } = response.data.data!;

    // Store tokens in cookies (with correct names for middleware)
    storageAdapter.setItem('access_token', accessToken);
    storageAdapter.setItem('refresh_token', refreshToken);

    return { user, accessToken, refreshToken };
  },

  // Register
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data
    );
    const { accessToken, refreshToken, user } = response.data.data!;

    // Store tokens in cookies (with correct names for middleware)
    storageAdapter.setItem('access_token', accessToken);
    storageAdapter.setItem('refresh_token', refreshToken);

    return { user, accessToken, refreshToken };
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Clear tokens from cookies
      storageAdapter.removeItem('access_token');
      storageAdapter.removeItem('refresh_token');
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data!;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/refresh',
      { refreshToken }
    );
    const { accessToken, refreshToken: newRefreshToken, user } = response.data.data!;

    // Update tokens in cookies
    storageAdapter.setItem('access_token', accessToken);
    if (newRefreshToken) {
      storageAdapter.setItem('refresh_token', newRefreshToken);
    }

    return { user, accessToken, refreshToken: newRefreshToken || refreshToken };
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post('/users/change-password', {
      currentPassword,
      newPassword,
    });
  },

  // Update profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>('/users/profile', data);
    return response.data.data!;
  },
  
  // Forgot password
  forgotPassword: async (data: { email: string }): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/forgot-password',
      data
    );
    return response.data.data!;
  },

  // Reset password
  resetPassword: async (data: { token: string; newPassword: string }): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/reset-password',
      data
    );
    return response.data.data!;
  },
};

// Export individual functions for convenience
export const login = authService.login;
export const register = authService.register;
export const logout = authService.logout;
export const getCurrentUser = authService.getCurrentUser;
export const refreshToken = authService.refreshToken;
export const changePassword = authService.changePassword;
export const updateProfile = authService.updateProfile;
export const forgotPassword = authService.forgotPassword;
export const resetPassword = authService.resetPassword;

// Re-export getAccessToken for convenience
export { getAccessToken };
