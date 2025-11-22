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
  timeout: 30000, // 30 seconds timeout
});

// Track if a token refresh is in progress to prevent multiple refresh requests
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Subscribe to token refresh completion
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Notify all subscribers when refresh is complete
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

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

    // Check if error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent infinite loops
      if (originalRequest.url?.includes('/auth/refresh')) {
        // Refresh token itself is invalid
        console.error('Refresh token is invalid or expired');
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        // If a refresh is already in progress, wait for it
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = storageAdapter.getItem('refresh_token');
        
        if (!refreshToken) {
          console.error('No refresh token found');
          clearAuthAndRedirect();
          return Promise.reject(error);
        }

        console.log('Token expired. Refreshing token...');

        // Try to refresh token
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          {
            timeout: 10000, // 10 seconds timeout for refresh
            withCredentials: true,
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        if (!accessToken) {
          throw new Error('No access token received from refresh');
        }

        console.log('Token refreshed successfully');

        // Store new tokens
        storageAdapter.setItem('access_token', accessToken);
        if (newRefreshToken) {
          storageAdapter.setItem('refresh_token', newRefreshToken);
        }

        // Notify all subscribers
        onRefreshed(accessToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        isRefreshing = false;
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        isRefreshing = false;
        refreshSubscribers = [];
        
        console.error('Token refresh failed:', refreshError.message);
        
        // Show user-friendly message
        if (typeof window !== 'undefined') {
          // You can use a toast notification here
          const event = new CustomEvent('auth:session-expired', {
            detail: { message: 'Your session has expired. Please login again.' }
          });
          window.dispatchEvent(event);
        }
        
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      console.error('Access forbidden - insufficient permissions');
    } else if (error.response?.status === 500) {
      console.error('Server error occurred');
    }

    return Promise.reject(error);
  }
);

// Helper function to clear auth and redirect
const clearAuthAndRedirect = () => {
  storageAdapter.removeItem('access_token');
  storageAdapter.removeItem('refresh_token');
  storageAdapter.removeItem('user');
  
  if (typeof window !== 'undefined') {
    // Store the current path to redirect back after login
    const currentPath = window.location.pathname;
    if (currentPath !== '/auth' && currentPath !== '/') {
      sessionStorage.setItem('redirect_after_login', currentPath);
    }
    
    // Redirect to auth page
    window.location.href = '/auth';
  }
};

export default apiClient;

// Helper functions
export const setAccessToken = (token: string) => {
  storageAdapter.setItem('access_token', token);
};

export const setRefreshToken = (token: string) => {
  storageAdapter.setItem('refresh_token', token);
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  storageAdapter.setItem('access_token', accessToken);
  storageAdapter.setItem('refresh_token', refreshToken);
};

export const clearTokens = () => {
  storageAdapter.removeItem('access_token');
  storageAdapter.removeItem('refresh_token');
  storageAdapter.removeItem('user');
};

export const getAccessToken = () => {
  return storageAdapter.getItem('access_token');
};

export const getRefreshToken = () => {
  return storageAdapter.getItem('refresh_token');
};

export const isAuthenticated = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  return !!(accessToken || refreshToken);
};
