import { api } from '../api-client';
import type { Settings } from '../types';

export const settingsApi = {
  // Get settings
  getSettings: async () => {
    return api.get<Settings>('/settings');
  },

  // Update settings
  updateSettings: async (data: Partial<Settings>) => {
    return api.put<Settings>('/settings', data);
  },

  // Update company info
  updateCompanyInfo: async (data: Partial<Settings>) => {
    return api.patch<Settings>('/settings/company', data);
  },

  // Update social media
  updateSocialMedia: async (data: Settings['socialMedia']) => {
    return api.patch<Settings>('/settings/social', data);
  },

  // Toggle maintenance mode
  toggleMaintenance: async (data: { enabled: boolean; message?: string }) => {
    return api.patch<Settings>('/settings/maintenance', data);
  },
};

