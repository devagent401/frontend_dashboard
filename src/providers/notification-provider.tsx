'use client';

import { useEffect, ReactNode } from 'react';
import { initializeSocket, disconnectSocket } from '@/lib/socket';
import { useNotificationStore } from '@/stores/notificationStore';
import { notificationsService } from '@/services/notifications.service';
import { useToast } from '@/components/ui/use-toast';
import { getAccessToken } from '@/lib/api-client';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { addNotification, setIsConnected, setNotifications, setUnreadCount } =
    useNotificationStore();
  const { toast } = useToast();

  useEffect(() => {
    const token = getAccessToken();
    
    if (!token) {
      return;
    }

    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const response = await notificationsService.getNotifications({
          page: 1,
          limit: 20,
        });
        setNotifications(response.data?.notifications || []);
        setUnreadCount(response.data?.unreadCount || 0);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();

    // Initialize socket connection
    const socket = initializeSocket(
      (notification) => {
        addNotification(notification);
        
        // Show toast notification
        toast({
          title: notification.title,
          description: notification.message,
          variant: notification.type === 'reject' ? 'destructive' : 'default',
        });
      },
      (order) => {
        // Handle order updates
        toast({
          title: 'Order Updated',
          description: `Order ${order.orderNumber} status changed to ${order.status}`,
        });
      }
    );

    if (socket) {
      setIsConnected(true);
    }

    // Cleanup on unmount
    return () => {
      disconnectSocket();
      setIsConnected(false);
    };
  }, [addNotification, setIsConnected, setNotifications, setUnreadCount, toast]);

  return <>{children}</>;
}

