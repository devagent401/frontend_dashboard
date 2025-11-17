import apiClient from '@/lib/api-client';
import { ApiResponse, Notification, PaginationParams } from '@/types/api';

export const notificationsService = {
  // Get user notifications
  getNotifications: async (params?: PaginationParams & {
    isRead?: boolean;
    type?: string;
  }): Promise<ApiResponse<{ notifications: Notification[]; unreadCount: number }>> => {
    const response = await apiClient.get<ApiResponse<{ notifications: Notification[]; unreadCount: number }>>('/notifications', { params });
    return response.data;
  },

  // Get notification by ID
  getNotification: async (id: string): Promise<Notification> => {
    const response = await apiClient.get<ApiResponse<Notification>>(`/notifications/${id}`);
    return response.data.data!;
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<Notification> => {
    const response = await apiClient.patch<ApiResponse<Notification>>(`/notifications/${id}/read`);
    return response.data.data!;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch('/notifications/read-all');
  },

  // Delete notification
  deleteNotification: async (id: string): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`);
  },

  // Get unread count
  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<ApiResponse<{ count: number }>>('/notifications/unread/count');
    return response.data.data!.count;
  },

  // Create notification (admin only)
  createNotification: async (data: Partial<Notification>): Promise<Notification> => {
    const response = await apiClient.post<ApiResponse<Notification>>('/notifications', data);
    return response.data.data!;
  },
};

