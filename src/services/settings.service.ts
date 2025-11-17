import apiClient from '@/lib/api-client';
import { ApiResponse, Settings } from '@/types/api';

export const settingsService = {
  // Get settings
  getSettings: async (): Promise<Settings> => {
    const response = await apiClient.get<ApiResponse<Settings>>('/settings');
    return response.data.data!;
  },

  // Update settings
  updateSettings: async (data: Partial<Settings>): Promise<Settings> => {
    const response = await apiClient.put<ApiResponse<Settings>>('/settings', data);
    return response.data.data!;
  },

  // Update company info
  updateCompanyInfo: async (data: Partial<Settings>): Promise<Settings> => {
    const response = await apiClient.patch<ApiResponse<Settings>>('/settings/company', data);
    return response.data.data!;
  },

  // Update social media
  updateSocialMedia: async (data: Settings['socialMedia']): Promise<Settings> => {
    const response = await apiClient.patch<ApiResponse<Settings>>('/settings/social', data);
    return response.data.data!;
  },

  // Toggle maintenance mode
  toggleMaintenance: async (enabled: boolean, message?: string): Promise<Settings> => {
    const response = await apiClient.patch<ApiResponse<Settings>>('/settings/maintenance', {
      enabled,
      message,
    });
    return response.data.data!;
  },
};

