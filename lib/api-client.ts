import { API_CONFIG, STORAGE_KEYS } from './config';
import type { ApiResponse, ApiError } from './types';

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  private async refreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) throw new Error('Token refresh failed');

      const data = await response.json();
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.data.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.data.refreshToken);
      
      return data.data.accessToken;
    } catch (error) {
      this.clearAuth();
      return null;
    }
  }

  private clearAuth() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token && !options.headers?.['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
        credentials: 'include',
      });

      clearTimeout(timeoutId);

      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401 && endpoint !== '/auth/refresh') {
        const newToken = await this.refreshToken();
        if (newToken) {
          // Retry with new token
          headers['Authorization'] = `Bearer ${newToken}`;
          const retryResponse = await fetch(`${this.baseURL}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include',
          });
          
          if (!retryResponse.ok) {
            const error = await retryResponse.json();
            throw error;
          }
          
          return await retryResponse.json();
        } else {
          // Redirect to login if refresh fails
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
          throw new Error('Authentication required');
        }
      }

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw error;
      }

      return await response.json();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw { success: false, message: 'Request timeout' };
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<T>(`${endpoint}${queryString}`, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // File upload
  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw error;
    }

    return await response.json();
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export instance methods as standalone functions for convenience
export const api = {
  get: apiClient.get.bind(apiClient),
  post: apiClient.post.bind(apiClient),
  put: apiClient.put.bind(apiClient),
  patch: apiClient.patch.bind(apiClient),
  delete: apiClient.delete.bind(apiClient),
  upload: apiClient.upload.bind(apiClient),
};

