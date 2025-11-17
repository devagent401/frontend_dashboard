import { api } from '../api-client';
import type { Notification, PaginationParams } from '../types';

export const notificationsApi = {
  // Get all notifications
  getNotifications: async (
    params?: PaginationParams & {
      isRead?: boolean;
      type?: string;
      priority?: string;
    }
  ) => {
    return api.get<Notification[]>('/notifications', params);
  },

  // Get notification by ID
  getNotification: async (id: string) => {
    return api.get<Notification>(`/notifications/${id}`);
  },

  // Get unread count
  getUnreadCount: async () => {
    return api.get<{ count: number }>('/notifications/unread/count');
  },

  // Mark as read
  markAsRead: async (id: string) => {
    return api.patch<Notification>(`/notifications/${id}/read`, {});
  },

  // Mark all as read
  markAllAsRead: async () => {
    return api.patch('/notifications/read-all', {});
  },

  // Delete notification
  deleteNotification: async (id: string) => {
    return api.delete(`/notifications/${id}`);
  },

  // Create notification (admin)
  createNotification: async (data: Partial<Notification>) => {
    return api.post<Notification>('/notifications', data);
  },
};

