import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storageAdapter } from '@/utils/storage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storageAdapter.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = storageAdapter.getItem('refresh_token');
        
        if (!refreshToken) {
          // No refresh token, redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/auth';
          }
          return Promise.reject(error);
        }

        // Try to refresh token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // Store new tokens in cookies
        storageAdapter.setItem('access_token', accessToken);
        if (newRefreshToken) {
          storageAdapter.setItem('refresh_token', newRefreshToken);
        }

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect
        storageAdapter.removeItem('access_token');
        storageAdapter.removeItem('refresh_token');
        
        if (typeof window !== 'undefined') {
          window.location.href = '/auth';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// Helper functions
export const setAccessToken = (token: string) => {
  storageAdapter.setItem('access_token', token);
};

export const clearTokens = () => {
  storageAdapter.removeItem('access_token');
  storageAdapter.removeItem('refresh_token');
};

export const getAccessToken = () => {
  return storageAdapter.getItem('access_token');
};

